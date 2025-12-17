import { useTreasuryBalance } from '../hooks/useTreasuryBalance'
import { useEthPrice } from '../hooks/useEthPrice'
import CountUp from './CountUp'

export default function TreasurySection() {
  const { formattedBalance, formattedEthOnly, formattedDaoTokens, totalBalanceEth, isLoading, isError } = useTreasuryBalance()
  const { price: ethPrice, isLoading: isPriceLoading, isError: isPriceError } = useEthPrice()

  const usdValue = ethPrice && totalBalanceEth ? totalBalanceEth * ethPrice : null

  return (
    <section className="w-full px-4 py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <div
          className="relative bg-[#2C5E86] rounded-[32px] px-[30px] py-[76px] md:px-16 md:py-[115px] overflow-hidden"
          style={{
            boxShadow:
              '0px 2px 4px -2px rgba(0, 0, 0, 0.1), 0px 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-4 md:gap-8">
            {/* ETH Amount with Icon */}
            <div className="flex flex-row items-center justify-center gap-4 md:gap-8">
              <img
                src="/eth-logo.svg"
                alt="ETH"
                className="w-[38px] h-[60px] md:w-[76px] md:h-[121px]"
              />
              <span
                className="text-[48px] md:text-[96px] font-semibold tracking-tight leading-tight"
                title={isLoading || isError ? undefined : `${formattedEthOnly} ETH + ${formattedDaoTokens} DAO`}
              >
                {isLoading ? <span className="text-white">...</span> : isError ? <span className="text-white">Error</span> : (
                  <>
                    <span className="text-[#5CB75A]">{formattedBalance}</span>
                    <span className="text-white"> ETH</span>
                  </>
                )}
              </span>
            </div>

            {/* USD Value */}
            <p className="text-[30px] md:text-[72px] font-normal leading-normal text-center">
              {isPriceLoading || isLoading ? <span className="text-white">...</span> : isPriceError || isError ? <span className="text-white">Error</span> : usdValue ? (
                usdValue >= 1_000_000_000 ? (
                  <>
                    <span className="text-[#5CB75A]">$<CountUp from={0.10} to={Number((usdValue / 1_000_000_000).toFixed(2))} duration={1} className="tabular-nums inline-block min-w-[3ch]" /></span>
                    <span className="text-white"> Billion</span>
                  </>
                ) : (
                  <>
                    <span className="text-[#5CB75A]">$<CountUp from={100.00} to={Number((usdValue / 1_000_000).toFixed(2))} duration={1} className="tabular-nums inline-block min-w-[3ch]" /></span>
                    <span className="text-white"> Million</span>
                  </>
                )
              ) : <span className="text-white">...</span>}
            </p>

            {/* Tagline */}
            <p className="text-white text-[24px] font-normal leading-none text-center">
              For Ethereum Security.
            </p>

            {/* CTA Button */}
            <button className="mt-4 bg-dao-red hover:bg-dao-red-hover text-white font-medium text-sm px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 h-10">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

