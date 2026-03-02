# Nara Solana Validator Explorer

Responsive web client for browsing Solana validators with multi-language (EN/中文) support. Built with Vite + React + TypeScript and managed by pnpm.

## Features
- Real-time validator list from `getVoteAccounts` (active + delinquent)
- Stats: active/delinquent counts, average commission, total activated stake
- Search and status filters
- Custom RPC endpoint input
- Language switcher (English/中文)
- Responsive layout for desktop and mobile

## Getting started
```bash
pnpm install
pnpm dev
```

Set a custom RPC in `.env` if needed:
```
VITE_RPC_ENDPOINT=https://mainnet-api.nara.build/
```

Build for production:
```bash
pnpm build
```
