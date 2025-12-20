import { useBalance, useReadContracts } from 'wagmi'
import { formatEther } from 'viem'

const TREASURY_ADDRESSES = [
  '0xa0526349A100618Ee4f981B016a51c53fF0DEC07', // slowMultisig
  '0x5256d6d94eD14667fa1661a99F5B142B1e051B8e', // fastMultisig
  '0xda4a4626d3e16e094de3225a751aab7128e96526', // oldMultisig
  '0x755cdba6ae4f479f7164792b318b2a06c759833b', // extraBalance
] as const

const THE_DAO_TOKEN = '0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413' as const

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
  // ETH balances
  const slowMultisig = useBalance({ address: TREASURY_ADDRESSES[0] })
  const fastMultisig = useBalance({ address: TREASURY_ADDRESSES[1] })
  const oldMultisig = useBalance({ address: TREASURY_ADDRESSES[2] })
  const extraBalance = useBalance({ address: TREASURY_ADDRESSES[3] })

  // DAO token balances (batched multicall)
  const daoTokenBalances = useReadContracts({
    contracts: TREASURY_ADDRESSES.map((address) => ({
      address: THE_DAO_TOKEN,
      abi: erc20BalanceOfAbi,
      functionName: 'balanceOf',
      args: [address],
    })),
  })

  const isLoading =
    slowMultisig.isLoading ||
    fastMultisig.isLoading ||
    oldMultisig.isLoading ||
    extraBalance.isLoading ||
    daoTokenBalances.isLoading

  const isError =
    slowMultisig.isError ||
    fastMultisig.isError ||
    oldMultisig.isError ||
    extraBalance.isError ||
    daoTokenBalances.isError

  // Total ETH balance
  const totalEthBalanceWei =
    (slowMultisig.data?.value ?? 0n) +
    (fastMultisig.data?.value ?? 0n) +
    (oldMultisig.data?.value ?? 0n) +
    (extraBalance.data?.value ?? 0n)

  // Total DAO token balance (in token smallest units, 16 decimals)
  const totalDaoTokens =
    daoTokenBalances.data?.reduce(
      (sum, result) => sum + ((result.result as bigint) ?? 0n),
      0n
    ) ?? 0n

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
      slowMultisig: slowMultisig.data,
      fastMultisig: fastMultisig.data,
      oldMultisig: oldMultisig.data,
      extraBalance: extraBalance.data,
    },
    daoTokenBalances: {
      slowMultisig: daoTokenBalances.data?.[0]?.result as bigint | undefined,
      fastMultisig: daoTokenBalances.data?.[1]?.result as bigint | undefined,
      oldMultisig: daoTokenBalances.data?.[2]?.result as bigint | undefined,
      extraBalance: daoTokenBalances.data?.[3]?.result as bigint | undefined,
      total: totalDaoTokens,
    },
  }
}

