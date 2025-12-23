/// <reference lib="deno.ns" />

import { createPublicClient, http, parseAbi, type Address } from "viem";
import { mainnet } from "viem/chains";

// =============================================================================
// Treasury Configuration
// =============================================================================

const TREASURY_ADDRESSES: readonly Address[] = [
  "0xa0526349A100618Ee4f981B016a51c53fF0DEC07", // slowMultisig
  "0x5256d6d94eD14667fa1661a99F5B142B1e051B8e", // fastMultisig
  "0xda4a4626d3e16e094de3225a751aab7128e96526", // oldMultisig
  "0x755cdba6ae4f479f7164792b318b2a06c759833b", // extraBalance
] as const;

const THE_DAO_TOKEN: Address = "0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413";
const MULTICALL3_ADDRESS: Address = "0xca11bde05977b3631167028862be2a173976ca11";

const multicall3Abi = parseAbi([
  "function getEthBalance(address addr) view returns (uint256 balance)",
]);

const erc20BalanceOfAbi = parseAbi([
  "function balanceOf(address account) view returns (uint256)",
]);

const ETH_RPC_URL = Deno.env.get("ETH_RPC_URL");

const client = createPublicClient({
  chain: mainnet,
  transport: http(ETH_RPC_URL),
});

// =============================================================================
// Deno KV Cache
// =============================================================================

const kv = await Deno.openKv();
const CACHE_KEY = ["treasury"];
const CACHE_TTL_MS = 2000;

interface CachedData {
  data: TreasuryResponse;
  timestamp: number;
}

export interface TreasuryResponse {
  balances: {
    slowMultisig: string;
    fastMultisig: string;
    oldMultisig: string;
    extraBalance: string;
  };
  daoTokenBalances: {
    slowMultisig: string;
    fastMultisig: string;
    oldMultisig: string;
    extraBalance: string;
  };
}

// =============================================================================
// Treasury Data Fetching
// =============================================================================

async function fetchFromRpc(): Promise<TreasuryResponse> {
  const [ethResults, tokenResults] = await Promise.all([
    client.multicall({
      contracts: TREASURY_ADDRESSES.map((address) => ({
        address: MULTICALL3_ADDRESS,
        abi: multicall3Abi,
        functionName: "getEthBalance",
        args: [address],
      })),
    }),
    client.multicall({
      contracts: TREASURY_ADDRESSES.map((address) => ({
        address: THE_DAO_TOKEN,
        abi: erc20BalanceOfAbi,
        functionName: "balanceOf",
        args: [address],
      })),
    }),
  ]);

  return {
    balances: {
      slowMultisig: ((ethResults[0].result as bigint) ?? 0n).toString(),
      fastMultisig: ((ethResults[1].result as bigint) ?? 0n).toString(),
      oldMultisig: ((ethResults[2].result as bigint) ?? 0n).toString(),
      extraBalance: ((ethResults[3].result as bigint) ?? 0n).toString(),
    },
    daoTokenBalances: {
      slowMultisig: ((tokenResults[0].result as bigint) ?? 0n).toString(),
      fastMultisig: ((tokenResults[1].result as bigint) ?? 0n).toString(),
      oldMultisig: ((tokenResults[2].result as bigint) ?? 0n).toString(),
      extraBalance: ((tokenResults[3].result as bigint) ?? 0n).toString(),
    },
  };
}

async function getTreasuryData(): Promise<TreasuryResponse> {
  const cached = await kv.get<CachedData>(CACHE_KEY);
  if (cached.value && Date.now() - cached.value.timestamp < CACHE_TTL_MS) {
    return cached.value.data;
  }
  const data = await fetchFromRpc();
  await kv.set(CACHE_KEY, { data, timestamp: Date.now() });
  return data;
}

// =============================================================================
// API Handler
// =============================================================================

export default async function treasury(_req: Request): Promise<Response> {
  try {
    const data = await getTreasuryData();
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=2",
      },
    });
  } catch (error) {
    console.error("Treasury API error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
