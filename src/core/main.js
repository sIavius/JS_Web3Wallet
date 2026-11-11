import CryptoApiClient from "./CryptoApi.js";
import { Wallet } from "./wallet.js";
import { InsufficientFundsError } from "../utils/errors.js";

const wallet = new Wallet("0x1111111111111111111111111111111111111111", new CryptoApiClient());
const recipient = "0x2222222222222222222222222222222222222222";
const asset = "ethereum";

console.log("Wallet:", wallet.maskedAddress);
wallet.deposit(10, asset);
console.log("Deposited: 10 ETH");
const payment = wallet.pay(3, asset, recipient);
console.log(`Payment #${payment.id}: 3 ETH to ${payment.address}`);

try {
    wallet.pay(8, asset, recipient);
} catch (error) {
    if (!(error instanceof InsufficientFundsError)) {
        throw error;
    }
    console.log(`Payment rejected: requested ${error.amount} ETH, available ${error.balance} ETH.`);
}

console.log(`Final balance: ${wallet.getTokenBalance(asset)} ETH`);
console.log("Transaction history:");
for (const page of wallet.getTransactionChunks(2)) {
    for (const transaction of page) {
        console.log(`  #${transaction.id} ${transaction.type} ${transaction.amount} ETH`);
    }
}
