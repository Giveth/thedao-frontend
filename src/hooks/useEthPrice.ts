import { useQuery } from '@tanstack/react-query'

interface CoinGeckoResponse {
  ethereum: {
    usd: number
  }
}

async function fetchEthPrice(): Promise<number> {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
  )
  if (!response.ok) {
    throw new Error('Failed to fetch ETH price')
  }
  const data: CoinGeckoResponse = await response.json()
  return data.ethereum.usd
}

export function useEthPrice() {
  const { data: price, isLoading, isError } = useQuery({
    queryKey: ['ethPrice'],
    queryFn: fetchEthPrice,
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Refetch every minute
  })

  return {
    price,
    isLoading,
    isError,
  }
}

