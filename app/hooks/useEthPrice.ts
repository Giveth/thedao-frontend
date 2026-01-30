import { useQuery } from '@tanstack/react-query'

interface CoinGeckoResponse {
  ethereum: {
    usd: number
  }
  dai: {
    usd: number
  }
}

interface PriceData {
  ethPrice: number
  daiPrice: number
  daiToEthRate: number
}

async function fetchPrices(): Promise<PriceData> {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,dai&vs_currencies=usd'
  )
  if (!response.ok) {
    throw new Error('Failed to fetch prices')
  }
  const data: CoinGeckoResponse = await response.json()
  const ethPrice = data.ethereum.usd
  const daiPrice = data.dai.usd
  return {
    ethPrice,
    daiPrice,
    daiToEthRate: daiPrice / ethPrice,
  }
}

export function useEthPrice() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['prices'],
    queryFn: fetchPrices,
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Refetch every minute
  })

  return {
    price: data?.ethPrice,
    daiPrice: data?.daiPrice,
    daiToEthRate: data?.daiToEthRate,
    isLoading,
    isError,
  }
}

