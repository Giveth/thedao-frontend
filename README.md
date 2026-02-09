# The DAO Fund Homepage

A modern React Router website for The DAO Fund, built with Deno, React 19, and TailwindCSS.

## Prerequisites

- [Deno](https://deno.land/) >= 2.0.0

## Running Locally

### 1. Install dependencies

```bash
deno i
```

### 2. Development mode

Start the development server with hot reload:

```bash
deno task dev
```

### 3. Production build

Build the application for production:

```bash
deno task build
```

### 4. Start production server

Serve the built application:

```bash
deno task start
```

### Other commands

| Command              | Description                        |
| -------------------- | ---------------------------------- |
| `deno task typecheck`| Run TypeScript type checking       |
| `deno task lint`     | Run Deno linter                    |

## Environment Variables

| Variable      | Required | Description                                                                 |
| ------------- | -------- | --------------------------------------------------------------------------- |
| `ETH_RPC_URL` | Yes      | Ethereum JSON-RPC endpoint URL (e.g., from DRPC, Alchemy, Infura, or a local node). Used to fetch treasury balances from the blockchain. |
| `BEACON_API_URL` | Yes      | Beacon API endpoint URL (e.g., from DRPC, Alchemy?, Infura?, or a local node). Used to fetch validator balances from the beacon chain. |

### Example `.env` file

```env
ETH_RPC_URL=https://lb.drpc.live/ethereum/<your-api-key>
BEACON_API_URL=https://lb.drpc.live/eth-beacon-chain/<your-api-key>
```

> **Note:** Deno automatically loads `.env` files. You can also pass environment variables directly when running:
> ```bash
> ETH_RPC_URL=https://... BEACON_API_URL=https://... deno task start
> ```

## Deno Deploy Configuration

When deploying to [Deno Deploy](https://deno.com/deploy), use the following settings:

| Setting              | Value             |
| -------------------- | ----------------- |
| **Install command**  | `deno i`          |
| **Build command**    | `deno task build` |
| **Pre-deploy command** | -               |
| **Build timeout**    | 5 minutes         |
| **Build memory limit** | 3GiB            |
| **Entrypoint**       | `server.ts`       |
| **Args**             | -                 |

### Environment Variables on Deno Deploy

Make sure to configure the `ETH_RPC_URL` and `BEACON_API_URL` environment variables in your Deno Deploy project settings under **Settings → Environment Variables**.

## Project Structure

```
├── api/                  # API route handlers (treasury, health)
├── app/
│   ├── components/       # React components
│   ├── context/          # React context providers
│   ├── data/             # Static data
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── routes/           # React Router routes
│   └── root.tsx          # Root layout component
├── public/               # Static assets
├── build/                # Production build output
├── server.ts             # Deno server entrypoint
├── deno.json             # Deno configuration
└── vite.config.ts        # Vite configuration
```

## License

See [LICENSE](./LICENSE) for details.

