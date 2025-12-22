import { useReadContracts } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { formatEther } from 'viem'

const TREASURY_ADDRESSES = [
  '0xa0526349A100618Ee4f981B016a51c53fF0DEC07', // slowMultisig
  '0x5256d6d94eD14667fa1661a99F5B142B1e051B8e', // fastMultisig
  '0xda4a4626d3e16e094de3225a751aab7128e96526', // oldMultisig
  '0x755cdba6ae4f479f7164792b318b2a06c759833b', // extraBalance
] as const

const THE_DAO_TOKEN = '0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413' as const
const MULTICALL3_ADDRESS = mainnet.contracts.multicall3.address

// Multicall3 getEthBalance ABI
const multicall3Abi = [
  {
    name: 'getEthBalance',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'addr', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
] as const

// ERC20 balanceOf ABI
const erc20BalanceOfAbi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const

// DAO token has 16 decimals, and each token = 0.01 ETH
// So we need to convert: (tokenBalance / 10^16) * 0.01 ETH = tokenBalance / 10^18 ETH
// In wei: tokenBalance * 10^18 / 10^18 = tokenBalance * 1 wei per smallest unit
const DAO_TOKEN_TO_WEI_MULTIPLIER = 1n

export function useTreasuryBalance() {
  // Single multicall for all ETH balances and DAO token balances
  const results = useReadContracts({
    contracts: [
      // ETH balances via Multicall3.getEthBalance (indices 0-3)
      ...TREASURY_ADDRESSES.map((address) => ({
        address: MULTICALL3_ADDRESS,
        abi: multicall3Abi,
        functionName: 'getEthBalance' as const,
        args: [address] as const,
      })),
      // DAO token balances (indices 4-7)
      ...TREASURY_ADDRESSES.map((address) => ({
        address: THE_DAO_TOKEN,
        abi: erc20BalanceOfAbi,
        functionName: 'balanceOf' as const,
        args: [address] as const,
      })),
    ],
  })

  const { isLoading, isError, data } = results

  // Extract ETH balances (first 4 results)
  const ethBalances = {
    slowMultisig: data?.[0]?.result as bigint | undefined,
    fastMultisig: data?.[1]?.result as bigint | undefined,
    oldMultisig: data?.[2]?.result as bigint | undefined,
    extraBalance: data?.[3]?.result as bigint | undefined,
  }

  // Extract DAO token balances (last 4 results)
  const daoTokenBalancesData = {
    slowMultisig: data?.[4]?.result as bigint | undefined,
    fastMultisig: data?.[5]?.result as bigint | undefined,
    oldMultisig: data?.[6]?.result as bigint | undefined,
    extraBalance: data?.[7]?.result as bigint | undefined,
  }

  // Total ETH balance
  const totalEthBalanceWei =
    (ethBalances.slowMultisig ?? 0n) +
    (ethBalances.fastMultisig ?? 0n) +
    (ethBalances.oldMultisig ?? 0n) +
    (ethBalances.extraBalance ?? 0n)

  // Total DAO token balance (in token smallest units, 16 decimals)
  const totalDaoTokens =
    (daoTokenBalancesData.slowMultisig ?? 0n) +
    (daoTokenBalancesData.fastMultisig ?? 0n) +
    (daoTokenBalancesData.oldMultisig ?? 0n) +
    (daoTokenBalancesData.extraBalance ?? 0n)

  // Convert DAO tokens to ETH equivalent (each token = 0.1 ETH)
  const daoTokenValueWei = totalDaoTokens * DAO_TOKEN_TO_WEI_MULTIPLIER

  const totalBalanceWei = totalEthBalanceWei + daoTokenValueWei

  const totalBalanceEth = parseFloat(formatEther(totalBalanceWei))
  const ethOnlyBalance = parseFloat(formatEther(totalEthBalanceWei))
  // DAO token has 16 decimals
  const daoTokenCount = Number(totalDaoTokens / 10n ** 16n)

  const formatNumber = (n: number) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n)

  const formattedBalance = formatNumber(totalBalanceEth)
  const formattedEthOnly = formatNumber(ethOnlyBalance)
  const formattedDaoTokens = formatNumber(daoTokenCount)

  return {
    totalBalanceWei,
    totalBalanceEth,
    formattedBalance,
    formattedEthOnly,
    formattedDaoTokens,
    isLoading,
    isError,
    balances: {
      slowMultisig: ethBalances.slowMultisig,
      fastMultisig: ethBalances.fastMultisig,
      oldMultisig: ethBalances.oldMultisig,
      extraBalance: ethBalances.extraBalance,
    },
    daoTokenBalances: {
      ...daoTokenBalancesData,
      total: totalDaoTokens,
    },
  }
}

