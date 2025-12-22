import { http, createConfig, fallback } from 'wagmi'
import { mainnet } from 'wagmi/chains'

const DRPC_API_KEY = import.meta.env.VITE_DRPC_API_KEY

export const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: fallback([
      // Primary: dRPC endpoint (if API key is configured)
      ...(DRPC_API_KEY
        ? [http(`https://lb.drpc.org/ogrpc?network=ethereum&dkey=${DRPC_API_KEY}`)]
        : []),
      // Fallback: public RPC
      http(),
    ]),
  },
})

