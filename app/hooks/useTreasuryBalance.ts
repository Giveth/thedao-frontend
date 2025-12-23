import { useQuery } from '@tanstack/react-query'
import { formatEther } from 'viem'

interface ApiResponse {
  balances: {
    slowMultisig: string
    fastMultisig: string
    oldMultisig: string
    extraBalance: string
  }
  daoTokenBalances: {
    slowMultisig: string
    fastMultisig: string
    oldMultisig: string
    extraBalance: string
  }
}

export interface TreasuryData {
  totalBalanceWei: string
  totalBalanceEth: number
  formattedBalance: string
  formattedEthOnly: string
  formattedDaoTokens: string
  balances: {
    slowMultisig: string
    fastMultisig: string
    oldMultisig: string
    extraBalance: string
  }
  daoTokenBalances: {
    slowMultisig: string
    fastMultisig: string
    oldMultisig: string
    extraBalance: string
    total: string
  }
}

const DAO_TOKEN_TO_WEI_MULTIPLIER = 1n

function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

function calculateTreasuryData(response: ApiResponse): TreasuryData {
  const ethBalances = {
    slowMultisig: BigInt(response.balances.slowMultisig),
    fastMultisig: BigInt(response.balances.fastMultisig),
    oldMultisig: BigInt(response.balances.oldMultisig),
    extraBalance: BigInt(response.balances.extraBalance),
  }

  const daoTokenBalancesData = {
    slowMultisig: BigInt(response.daoTokenBalances.slowMultisig),
    fastMultisig: BigInt(response.daoTokenBalances.fastMultisig),
    oldMultisig: BigInt(response.daoTokenBalances.oldMultisig),
    extraBalance: BigInt(response.daoTokenBalances.extraBalance),
  }

  const totalEthBalanceWei =
    ethBalances.slowMultisig +
    ethBalances.fastMultisig +
    ethBalances.oldMultisig +
    ethBalances.extraBalance

  const totalDaoTokens =
    daoTokenBalancesData.slowMultisig +
    daoTokenBalancesData.fastMultisig +
    daoTokenBalancesData.oldMultisig +
    daoTokenBalancesData.extraBalance

  const daoTokenValueWei = totalDaoTokens * DAO_TOKEN_TO_WEI_MULTIPLIER
  const totalBalanceWei = totalEthBalanceWei + daoTokenValueWei

  const totalBalanceEth = parseFloat(formatEther(totalBalanceWei))
  const ethOnlyBalance = parseFloat(formatEther(totalEthBalanceWei))
  const daoTokenCount = Number(totalDaoTokens / 10n ** 16n)

  return {
    totalBalanceWei: totalBalanceWei.toString(),
    totalBalanceEth,
    formattedBalance: formatNumber(totalBalanceEth),
    formattedEthOnly: formatNumber(ethOnlyBalance),
    formattedDaoTokens: formatNumber(daoTokenCount),
    balances: response.balances,
    daoTokenBalances: {
      ...response.daoTokenBalances,
      total: totalDaoTokens.toString(),
    },
  }
}

async function fetchTreasuryBalance(): Promise<TreasuryData> {
  const response = await fetch('/api/treasury')
  if (!response.ok) {
    throw new Error('Failed to fetch treasury balance')
  }
  const data: ApiResponse = await response.json()
  return calculateTreasuryData(data)
}

export function useTreasuryBalance() {
  const { data, isLoading, isError } = useQuery<TreasuryData>({
    queryKey: ['treasuryBalance'],
    queryFn: fetchTreasuryBalance,
    staleTime: 2000, // 2 seconds to match server cache
    refetchInterval: 5000, // Optional: refetch every 5 seconds
  })

  return {
    totalBalanceWei: data?.totalBalanceWei,
    totalBalanceEth: data?.totalBalanceEth,
    formattedBalance: data?.formattedBalance,
    formattedEthOnly: data?.formattedEthOnly,
    formattedDaoTokens: data?.formattedDaoTokens,
    balances: data?.balances,
    daoTokenBalances: data?.daoTokenBalances,
    isLoading,
    isError,
  }
}
