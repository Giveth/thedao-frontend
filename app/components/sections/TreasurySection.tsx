import { useTreasuryBalance } from '~/hooks/useTreasuryBalance'
import { useEthPrice } from '~/hooks/useEthPrice'
import RisingNumber from '../text-animations/RisingNumber'

const ethFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const usdFormat = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const formatEth = (n: number): [string, string] => [ethFormat.format(n), ' ETH']
const formatUsd = (n: number): [string, string] =>
  n >= 1_000_000_000
    ? ['$' + usdFormat.format(n / 1_000_000_000), ' Billion']
    : ['$' + usdFormat.format(n / 1_000_000), ' Million']

// While the balance and price load, the counts already climb toward these.
// They must stay below the real values, or the count turns around when the
// data lands. In Nov 2026 the treasury was ~74,000 ETH (~69,000 staked) at
// ~$1,650 an ETH ($122M), so these hold unless the treasury shrinks by a fifth
// or ETH falls under ~$1,200.
const ETH_FLOOR = 60_000
const USD_FROM = 50_000_000
const USD_FLOOR = 90_000_000

export default function TreasurySection() {
  const { totals, formattedTotals, isLoading, isError } = useTreasuryBalance()
  const { price: ethPrice, daiToEthRate, isLoading: isPriceLoading, isError: isPriceError } = useEthPrice()

  // Calculate total in ETH: ETH + WETH + DAI (converted) + DAO
  const totalBalanceEth = totals && daiToEthRate !== undefined
    ? totals.eth + totals.weth + (totals.dai * daiToEthRate) + (totals.dao / 100) // DAO is in 100ths of ETH
    : null

  const usdValue = ethPrice && totalBalanceEth ? totalBalanceEth * ethPrice : undefined

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
                {isError || isPriceError ? <span className="text-white">Error</span> : (
                  <RisingNumber
                    value={totalBalanceEth ?? undefined}
                    from={0}
                    floor={ETH_FLOOR}
                    format={formatEth}
                    className="text-dao-green tabular-nums inline-block min-w-[3ch]"
                    suffixClassName="text-white whitespace-pre"
                  />
                )}
              </span>
            </div>

            {/* USD Value */}
            <p className="text-2xl md:text-7xl font-normal leading-normal text-center">
              {isPriceError || isError ? <span className="text-white">Error</span> : (
                <RisingNumber
                  value={usdValue}
                  from={USD_FROM}
                  floor={USD_FLOOR}
                  format={formatUsd}
                  className="text-dao-green tabular-nums inline-block min-w-[3ch]"
                  suffixClassName="text-white whitespace-pre"
                />
              )}
            </p>

            {/* Tagline */}
            <p className="text-white text-xl md:text-2xl font-normal leading-snug text-center md:max-w-md">
              An endowment for Ethereum security, earning 1,800 ETH a year.
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

