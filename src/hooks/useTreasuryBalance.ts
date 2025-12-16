import { useBalance } from 'wagmi'
import { formatEther } from 'viem'

const TREASURY_ADDRESSES = {
  slowMultisig: '0xa0526349A100618Ee4f981B016a51c53fF0DEC07',
  fastMultisig: '0x5256d6d94eD14667fa1661a99F5B142B1e051B8e',
  oldMultisig: '0xda4a4626d3e16e094de3225a751aab7128e96526',
  extraBalance: '0x755cdba6ae4f479f7164792b318b2a06c759833b',
} as const

export function useTreasuryBalance() {
  const slowMultisig = useBalance({
    address: TREASURY_ADDRESSES.slowMultisig,
  })
  const fastMultisig = useBalance({
    address: TREASURY_ADDRESSES.fastMultisig,
  })
  const oldMultisig = useBalance({
    address: TREASURY_ADDRESSES.oldMultisig,
  })
  const extraBalance = useBalance({
    address: TREASURY_ADDRESSES.extraBalance,
  })

  const isLoading =
    slowMultisig.isLoading ||
    fastMultisig.isLoading ||
    oldMultisig.isLoading ||
    extraBalance.isLoading

  const isError =
    slowMultisig.isError ||
    fastMultisig.isError ||
    oldMultisig.isError ||
    extraBalance.isError

  const totalBalanceWei =
    (slowMultisig.data?.value ?? 0n) +
    (fastMultisig.data?.value ?? 0n) +
    (oldMultisig.data?.value ?? 0n) +
    (extraBalance.data?.value ?? 0n)

  const totalBalanceEth = parseFloat(formatEther(totalBalanceWei))

  const formattedBalance = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(totalBalanceEth)

  return {
    totalBalanceWei,
    totalBalanceEth,
    formattedBalance,
    isLoading,
    isError,
    balances: {
      slowMultisig: slowMultisig.data,
      fastMultisig: fastMultisig.data,
      oldMultisig: oldMultisig.data,
      extraBalance: extraBalance.data,
    },
  }
}

