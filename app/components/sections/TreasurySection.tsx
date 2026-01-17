import { useTreasuryBalance } from '~/hooks/useTreasuryBalance'
import { useEthPrice } from '~/hooks/useEthPrice'
import CountUp from '../text-animations/CountUp'

export default function TreasurySection() {
  const { formattedBalance, formattedEthOnly, formattedDaoTokens, totalBalanceEth, isLoading, isError } = useTreasuryBalance()
  const { price: ethPrice, isLoading: isPriceLoading, isError: isPriceError } = useEthPrice()

  const usdValue = ethPrice && totalBalanceEth ? totalBalanceEth * ethPrice : null

  return (
    <section className="w-full px-4 pt-16">
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
                title={isLoading || isError ? undefined : `${formattedEthOnly} ETH + ${formattedDaoTokens} DAO`}
              >
                {isLoading ? <span className="text-white">...</span> : isError ? <span className="text-white">Error</span> : (
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
            <button type="button" className="mt-4 bg-dao-red hover:bg-dao-red-hover text-white font-medium text-sm px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 h-12">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

