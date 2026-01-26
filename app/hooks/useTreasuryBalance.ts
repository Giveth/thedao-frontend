import { useQuery } from '@tanstack/react-query'
import { formatEther } from 'viem'

interface ApiResponse {
  balances: {
    ogCuratorsMultisig: string
    operationalMultisig: string
    stakingMultisig: string
    oldMultisig: string
    extraBalance: string
  }
  daoTokenBalances: {
    ogCuratorsMultisig: string
    operationalMultisig: string
    stakingMultisig: string
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
    ogCuratorsMultisig: string
    operationalMultisig: string
    stakingMultisig: string
    oldMultisig: string
    extraBalance: string
  }
  daoTokenBalances: {
    ogCuratorsMultisig: string
    operationalMultisig: string
    stakingMultisig: string
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
    ogCuratorsMultisig: BigInt(response.balances.ogCuratorsMultisig),
    operationalMultisig: BigInt(response.balances.operationalMultisig),
    stakingMultisig: BigInt(response.balances.stakingMultisig),
    oldMultisig: BigInt(response.balances.oldMultisig),
    extraBalance: BigInt(response.balances.extraBalance),
  }

  const daoTokenBalancesData = {
    ogCuratorsMultisig: BigInt(response.daoTokenBalances.ogCuratorsMultisig),
    operationalMultisig: BigInt(response.daoTokenBalances.operationalMultisig),
    stakingMultisig: BigInt(response.daoTokenBalances.stakingMultisig),
    oldMultisig: BigInt(response.daoTokenBalances.oldMultisig),
    extraBalance: BigInt(response.daoTokenBalances.extraBalance),
  }

  const totalEthBalanceWei =
    ethBalances.ogCuratorsMultisig +
    ethBalances.operationalMultisig +
    ethBalances.stakingMultisig +
    ethBalances.oldMultisig +
    ethBalances.extraBalance

  const totalDaoTokens =
    daoTokenBalancesData.ogCuratorsMultisig +
    daoTokenBalancesData.operationalMultisig +
    daoTokenBalancesData.stakingMultisig +
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
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Refetch every minute
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
