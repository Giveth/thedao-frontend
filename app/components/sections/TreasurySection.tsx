import { useTreasuryBalance } from '~/hooks/useTreasuryBalance'
import { useEthPrice } from '~/hooks/useEthPrice'
import CountUp from '../text-animations/CountUp'

function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

export default function TreasurySection() {
  const { totals, formattedTotals, isLoading, isError } = useTreasuryBalance()
  const { price: ethPrice, daiToEthRate, isLoading: isPriceLoading, isError: isPriceError } = useEthPrice()

  // Calculate total in ETH: ETH + WETH + DAI (converted) + DAO
  const totalBalanceEth = totals && daiToEthRate !== undefined
    ? totals.eth + totals.weth + (totals.dai * daiToEthRate) + (totals.dao / 100) // DAO is in 100ths of ETH
    : null

  const formattedBalance = totalBalanceEth ? formatNumber(totalBalanceEth) : null
  const usdValue = ethPrice && totalBalanceEth ? totalBalanceEth * ethPrice : null

  // Build title showing non-zero balances only
  const titleParts: string[] = []
  if (formattedTotals) {
    if (totals && totals.eth > 0) titleParts.push(`${formattedTotals.eth} ETH`)
    if (totals && totals.weth > 0) titleParts.push(`${formattedTotals.weth} WETH`)
    if (totals && totals.dai > 0) titleParts.push(`${formattedTotals.dai} DAI`)
    if (totals && totals.dao > 0) titleParts.push(`${formattedTotals.dao} DAO`)
  }
  const titleText = titleParts.length > 0 ? titleParts.join(' + ') : undefined

  return (
    <section id="treasury" className="w-full px-4 pt-16 scroll-mt-28">
      <div className="max-w-10xl mx-auto mt-[calc(-100px)] relative z-10">
        <div
          className="relative bg-dao-blue-light rounded-card px-8 py-[76px] md:px-16 md:py-[115px] overflow-hidden shadow-md"
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-4 md:gap-8">
            {/* ETH Amount with Icon */}
            <div className="flex flex-row items-center justify-center gap-4 md:gap-8">
              <img
                src="/eth-logo.svg"
                alt="ETH"
                className="w-[38px] h-15 md:w-[76px] md:h-[121px]"
              />
              <span
                className="text-4xl md:text-8xl font-semibold tracking-tight leading-tight"
                title={isLoading || isError || isPriceLoading ? undefined : titleText}
              >
                {isLoading || isPriceLoading ? <span className="text-white">...</span> : isError || isPriceError ? <span className="text-white">Error</span> : (
                  <>
                    <span className="text-dao-green tabular-nums inline-block min-w-[3ch]">{formattedBalance}</span>
                    <span className="text-white"> ETH</span>
                  </>
                )}
              </span>
            </div>

            {/* USD Value */}
            <p className="text-2xl md:text-7xl font-normal leading-normal text-center">
              {isPriceLoading || isLoading ? <span className="text-white">...</span> : isPriceError || isError ? <span className="text-white">Error</span> : usdValue ? (
                usdValue >= 1_000_000_000 ? (
                  <>
                    <span className="text-dao-green">$<CountUp from={0.10} to={Number((usdValue / 1_000_000_000).toFixed(2))} duration={1} className="tabular-nums inline-block min-w-[3ch]" /></span>
                    <span className="text-white"> Billion</span>
                  </>
                ) : (
                  <>
                    <span className="text-dao-green">$<CountUp from={100.00} to={Number((usdValue / 1_000_000).toFixed(2))} duration={1} className="tabular-nums inline-block min-w-[3ch]" /></span>
                    <span className="text-white"> Million</span>
                  </>
                )
              ) : <span className="text-white">...</span>}
            </p>

            {/* Tagline */}
            <p className="text-white text-2xl font-normal leading-none text-center">
              For Ethereum Security.
            </p>

            {/* CTA Button */}
            <a href="https://paragraph.com/@thedao.fund/thedao-security-fund-activating-75000-eth-for-ethereum-security" target="_blank" rel="noopener noreferrer" className="mt-4 bg-dao-red hover:bg-dao-red-hover text-white font-medium text-sm px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 h-12 inline-flex items-center">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

