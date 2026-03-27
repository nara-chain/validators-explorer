<p align="center">
  <img src="https://raw.githubusercontent.com/nara-chain/nara-web/main/public/favicon-v3.svg" width="48" />
</p>

<h3 align="center">Nara Validator Explorer</h3>
<p align="center">
  Real-time validator dashboard for the Nara network.
  <br />
  <a href="https://validators.nara.build">validators.nara.build</a>
</p>

---

Lightweight web client for monitoring validator status, stake distribution, and network health. Supports English and 中文.

## Features

```
Real-time validator list        Active and delinquent nodes
Network stats                   Active count · avg commission · total staked
Search & filters                By name, status, commission
Custom RPC endpoint             Connect to any Nara cluster
Multi-language                  English / 中文
Responsive                      Desktop + mobile
```

## Quick Start

```bash
pnpm install
pnpm dev
```

Custom RPC via `.env`:

```
VITE_RPC_ENDPOINT=https://devnet-api.nara.build/
```

Production build:

```bash
pnpm build
```

## Stack

```
Vite · React 18 · TypeScript · i18next · pnpm
```

## License

MIT

## Links

[Explorer](https://explorer.nara.build) · [Website](https://nara.build) · [GitHub](https://github.com/nara-chain) · [X](https://x.com/NaraBuildAI)
