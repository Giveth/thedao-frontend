/// <reference lib="deno.ns" />

import { createPublicClient, http, parseAbi, type Address } from "viem";
import { mainnet } from "viem/chains";

// =============================================================================
// Treasury Configuration
// =============================================================================

// Addresses for ETH balance queries (extraBalance has unrecoverable ERC20s)
const ETH_TREASURY_ADDRESSES: readonly Address[] = [
  "0xa0526349A100618Ee4f981B016a51c53fF0DEC07", // ogCuratorsMultisig
  "0x5256d6d94eD14667fa1661a99F5B142B1e051B8e", // operationalMultisig
  "0x52016A661a6cd35d88d30297E8840998ac3Db756", // stakingMultisig
  "0x755cdba6ae4f479f7164792b318b2a06c759833b", // extraBalance
] as const;

// Addresses for ERC20 balance queries (excludes extraBalance - tokens are unrecoverable)
const ERC20_TREASURY_ADDRESSES: readonly Address[] = [
  "0xa0526349A100618Ee4f981B016a51c53fF0DEC07", // ogCuratorsMultisig
  "0x5256d6d94eD14667fa1661a99F5B142B1e051B8e", // operationalMultisig
  "0x52016A661a6cd35d88d30297E8840998ac3Db756", // stakingMultisig
] as const;

const THE_DAO_TOKEN: Address = "0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413";
const WETH_TOKEN: Address = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const DAI_TOKEN: Address = "0x6b175474e89094c44da98b954eedeac495271d0f";
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

interface EthBalances {
  ogCuratorsMultisig: string;
  operationalMultisig: string;
  stakingMultisig: string;
  extraBalance: string;
}

interface Erc20Balances {
  ogCuratorsMultisig: string;
  operationalMultisig: string;
  stakingMultisig: string;
}

export interface TreasuryResponse {
  balances: EthBalances;
  daoTokenBalances: Erc20Balances;
  wethBalances: Erc20Balances;
  daiBalances: Erc20Balances;
}

// =============================================================================
// Treasury Data Fetching
// =============================================================================

async function fetchFromRpc(): Promise<TreasuryResponse> {
  const [ethResults, daoTokenResults, wethResults, daiResults] = await Promise.all([
    client.multicall({
      contracts: ETH_TREASURY_ADDRESSES.map((address) => ({
        address: MULTICALL3_ADDRESS,
        abi: multicall3Abi,
        functionName: "getEthBalance",
        args: [address],
      })),
    }),
    client.multicall({
      contracts: ERC20_TREASURY_ADDRESSES.map((address) => ({
        address: THE_DAO_TOKEN,
        abi: erc20BalanceOfAbi,
        functionName: "balanceOf",
        args: [address],
      })),
    }),
    client.multicall({
      contracts: ERC20_TREASURY_ADDRESSES.map((address) => ({
        address: WETH_TOKEN,
        abi: erc20BalanceOfAbi,
        functionName: "balanceOf",
        args: [address],
      })),
    }),
    client.multicall({
      contracts: ERC20_TREASURY_ADDRESSES.map((address) => ({
        address: DAI_TOKEN,
        abi: erc20BalanceOfAbi,
        functionName: "balanceOf",
        args: [address],
      })),
    }),
  ]);

  const toEthBalances = (results: typeof ethResults): EthBalances => ({
    ogCuratorsMultisig: ((results[0].result as bigint) ?? 0n).toString(),
    operationalMultisig: ((results[1].result as bigint) ?? 0n).toString(),
    stakingMultisig: ((results[2].result as bigint) ?? 0n).toString(),
    extraBalance: ((results[3].result as bigint) ?? 0n).toString(),
  });

  const toErc20Balances = (results: typeof daoTokenResults): Erc20Balances => ({
    ogCuratorsMultisig: ((results[0].result as bigint) ?? 0n).toString(),
    operationalMultisig: ((results[1].result as bigint) ?? 0n).toString(),
    stakingMultisig: ((results[2].result as bigint) ?? 0n).toString(),
  });

  return {
    balances: toEthBalances(ethResults),
    daoTokenBalances: toErc20Balances(daoTokenResults),
    wethBalances: toErc20Balances(wethResults),
    daiBalances: toErc20Balances(daiResults),
  };
}

async function getTreasuryData(): Promise<TreasuryResponse> {
  const cached = await kv.get<CachedData>(CACHE_KEY);
  if (cached.value && Date.now() - cached.value.timestamp < CACHE_TTL_MS) {
    return cached.value.data;
  }
  const data = await fetchFromRpc();
  
  // Add 69,420 ETH back to stakingMultisig to account for the ETH moved out for staking
  const stakedEth = "69420000000000000000000"; // 69,420 ETH in wei
  const currentStakingBalance = BigInt(data.balances.stakingMultisig);
  const adjustedStakingBalance = currentStakingBalance + BigInt(stakedEth);
  
  const adjustedData: TreasuryResponse = {
    ...data,
    balances: {
      ...data.balances,
      stakingMultisig: adjustedStakingBalance.toString()
    }
  };
  
  await kv.set(CACHE_KEY, { data: adjustedData, timestamp: Date.now() });
  return adjustedData;
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
