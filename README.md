# JavaScript Wallet Simulator

A console-based wallet simulator written in vanilla JavaScript. It tracks balances and transactions in memory and provides a core that a browser UI can reuse. All deposits and payments in the demo are simulated.

## Run the demo

From the repository root, run this command with Node.js:

```sh
node src/core/main.js
```

The demo deposits 10 ETH, pays 3 ETH, and rejects an 8 ETH payment. It prints a final balance of 7 ETH and a history containing the deposit and the successful payment. Both the demo and the tests run without installing dependencies or calling an external API.

Run the tests with the built-in Node.js test runner:

```sh
npm test
```

## Current features

- Simulated deposits and payments, with balances tracked separately for each asset.
- Payment validation for amount, Ethereum-style recipient address, and available balance.
- In-memory history with local transaction IDs, recipient addresses for payments, and generator-based pagination in insertion order.
- A CoinGecko price client for querying asset prices by API ID separately from the demo. The tests use an injected price client.

Balances use JavaScript numbers for this simulation. The project does not hold keys, sign transactions, or broadcast to a blockchain.

## Roadmap

| Stage | Scope |
| --- | --- |
| **1. Console core** · complete | Test address, local transaction IDs, recipient details, and automated tests for successful and rejected payments. |
| **2. Vanilla browser UI** · planned | Reuse the core in a payment form with balance and history views, inline errors, and an activity chart. |
| **3. React UI** · planned | Build a React and TypeScript interface around the same core. Explore a separate testnet integration with an external wallet as a follow-up. |
