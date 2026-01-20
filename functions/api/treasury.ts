import { createPublicClient, http, parseAbi, type Address } from "viem";
import { mainnet } from "viem/chains";

interface Env {
  ETH_RPC_URL: string;
}

interface TreasuryResponse {
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

const TREASURY_ADDRESSES: readonly Address[] = [
  "0xa0526349A100618Ee4f981B016a51c53fF0DEC07",
  "0x5256d6d94eD14667fa1661a99F5B142B1e051B8e",
  "0xda4a4626d3e16e094de3225a751aab7128e96526",
  "0x755cdba6ae4f479f7164792b318b2a06c759833b",
] as const;

const THE_DAO_TOKEN: Address = "0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413";
const MULTICALL3_ADDRESS: Address = "0xca11bde05977b3631167028862be2a173976ca11";

const multicall3Abi = parseAbi([
  "function getEthBalance(address addr) view returns (uint256 balance)",
]);

const erc20BalanceOfAbi = parseAbi([
  "function balanceOf(address account) view returns (uint256)",
]);

async function fetchTreasuryData(ethRpcUrl: string): Promise<TreasuryResponse> {
  const client = createPublicClient({
    chain: mainnet,
    transport: http(ethRpcUrl),
  });

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

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const data = await fetchTreasuryData(context.env.ETH_RPC_URL);
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
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
};
