import { useTreasuryBalance } from '../hooks/useTreasuryBalance'
import { useEthPrice } from '../hooks/useEthPrice'

const EthereumIcon = () => (
  <svg
    width="76"
    height="121"
    viewBox="0 0 256 417"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid"
    className="drop-shadow-lg"
  >
    <path
      fill="#fff"
      d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"
      opacity="0.6"
    />
    <path fill="#fff" d="M127.962 0L0 212.32l127.962 75.639V154.158z" />
    <path
      fill="#fff"
      d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.601L256 236.587z"
      opacity="0.6"
    />
    <path fill="#fff" d="M127.962 416.905v-104.72L0 236.585z" />
    <path
      fill="#fff"
      d="M127.961 287.958l127.96-75.637-127.96-58.162z"
      opacity="0.2"
    />
    <path fill="#fff" d="M0 212.32l127.96 75.638v-133.8z" opacity="0.6" />
  </svg>
)

function formatUsdValue(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)} Billion`
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)} Million`
  }
  return `$${new Intl.NumberFormat('en-US').format(Math.round(value))}`
}

export default function TreasurySection() {
  const { formattedBalance, formattedEthOnly, formattedDaoTokens, totalBalanceEth, isLoading, isError } = useTreasuryBalance()
  const { price: ethPrice, isLoading: isPriceLoading, isError: isPriceError } = useEthPrice()

  const usdValue = ethPrice && totalBalanceEth ? totalBalanceEth * ethPrice : null

  return (
    <section className="w-full px-4 py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <div
          className="relative bg-[#2C5E86] rounded-[32px] px-8 py-16 md:px-16 md:py-20 shadow-lg overflow-hidden"
          style={{
            boxShadow:
              '0px 2px 4px -2px rgba(0, 0, 0, 0.1), 0px 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* ETH Amount with Icon */}
            <div className="flex flex-row items-center justify-center gap-6 md:gap-8">
              <EthereumIcon />
              <span
                className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-[96px] font-semibold tracking-tight"
                style={{ fontFamily: "'Inter Tight', Inter, sans-serif" }}
                title={isLoading || isError ? undefined : `${formattedEthOnly} ETH + ${formattedDaoTokens} DAO`}
              >
                {isLoading ? '...' : isError ? 'Error' : `${formattedBalance} ETH`}
              </span>
            </div>

            {/* USD Value */}
            <p
              className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal"
              style={{ fontFamily: "'Inter Tight', Inter, sans-serif" }}
            >
              {isPriceLoading || isLoading ? '...' : isPriceError || isError ? 'Error' : usdValue ? formatUsdValue(usdValue) : '...'}
            </p>

            {/* Tagline */}
            <p
              className="text-white text-xl md:text-2xl font-normal"
              style={{ fontFamily: "'Inter Tight', Inter, sans-serif" }}
            >
              For Ethereum Security.
            </p>

            {/* CTA Button */}
            <button className="mt-4 bg-dao-red hover:bg-dao-red-hover text-white font-medium text-sm px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

