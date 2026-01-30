import { useQuery } from '@tanstack/react-query'
import { formatEther } from 'viem'

interface EthBalances {
  ogCuratorsMultisig: string
  operationalMultisig: string
  stakingMultisig: string
  extraBalance: string
}

interface Erc20Balances {
  ogCuratorsMultisig: string
  operationalMultisig: string
  stakingMultisig: string
}

interface ApiResponse {
  balances: EthBalances
  daoTokenBalances: Erc20Balances
  wethBalances: Erc20Balances
  daiBalances: Erc20Balances
}

export interface TokenTotals {
  eth: number
  weth: number
  dai: number
  dao: number
}

export interface TreasuryData {
  totals: TokenTotals
  formattedTotals: {
    eth: string
    weth: string
    dai: string
    dao: string
  }
  balances: EthBalances
  daoTokenBalances: Erc20Balances & { total: string }
  wethBalances: Erc20Balances & { total: string }
  daiBalances: Erc20Balances & { total: string }
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

function sumEthBalances(balances: EthBalances): bigint {
  return (
    BigInt(balances.ogCuratorsMultisig) +
    BigInt(balances.operationalMultisig) +
    BigInt(balances.stakingMultisig) +
    BigInt(balances.extraBalance)
  )
}

function sumErc20Balances(balances: Erc20Balances): bigint {
  return (
    BigInt(balances.ogCuratorsMultisig) +
    BigInt(balances.operationalMultisig) +
    BigInt(balances.stakingMultisig)
  )
}

function calculateTreasuryData(response: ApiResponse): TreasuryData {
  const totalEthWei = sumEthBalances(response.balances)
  const totalWethWei = sumErc20Balances(response.wethBalances)
  const totalDaiWei = sumErc20Balances(response.daiBalances)
  const totalDaoTokens = sumErc20Balances(response.daoTokenBalances)

  // Convert to readable numbers (all are 18 decimals except DAO which is 16)
  const ethBalance = parseFloat(formatEther(totalEthWei))
  const wethBalance = parseFloat(formatEther(totalWethWei))
  const daiBalance = parseFloat(formatEther(totalDaiWei))
  const daoTokenCount = Number(totalDaoTokens / 10n ** 16n)

  return {
    totals: {
      eth: ethBalance,
      weth: wethBalance,
      dai: daiBalance,
      dao: daoTokenCount,
    },
    formattedTotals: {
      eth: formatNumber(ethBalance),
      weth: formatNumber(wethBalance),
      dai: formatNumber(daiBalance),
      dao: formatNumber(daoTokenCount),
    },
    balances: response.balances,
    daoTokenBalances: {
      ...response.daoTokenBalances,
      total: totalDaoTokens.toString(),
    },
    wethBalances: {
      ...response.wethBalances,
      total: totalWethWei.toString(),
    },
    daiBalances: {
      ...response.daiBalances,
      total: totalDaiWei.toString(),
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
    totals: data?.totals,
    formattedTotals: data?.formattedTotals,
    balances: data?.balances,
    daoTokenBalances: data?.daoTokenBalances,
    wethBalances: data?.wethBalances,
    daiBalances: data?.daiBalances,
    isLoading,
    isError,
  }
}
