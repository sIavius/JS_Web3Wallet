# JavaScript Wallet Simulator

A console-based wallet simulator written in vanilla JavaScript. It tracks balances and transactions in memory and provides a core that a browser UI can reuse. All deposits and payments in the demo are simulated.

## Run the demo

From the repository root, run this command with Node.js:

```sh
node src/core/main.js
```

The demo simulates deposits and payments, then prints the transaction history in pages of two records. It runs without installing dependencies or calling an external API.

## Current features

- Simulated deposits and payments, with balances tracked separately for each asset.
- Payment validation for amount, Ethereum-style recipient address, and available balance.
- In-memory transaction history, paginated with a JavaScript generator.
- A CoinGecko price client for querying asset prices separately from the demo.

## Roadmap

| Stage | Scope |
| --- | --- |
| **1. Console core** · in progress | Finish the demo with a test address, stable local transaction IDs, recipient details, and automated tests for successful and rejected payments. |
| **2. Vanilla browser UI** · planned | Reuse the core in a payment form with balance and history views, inline errors, and an activity chart. |
| **3. React UI** · planned | Build a React and TypeScript interface around the same core. Explore a separate testnet integration with an external wallet as a follow-up. |
