//main.js
import {InvalidAmountError, InsufficientFundsError, InvalidAddressError, ApiNetworkError} from "../utils/errors.js"
import {Wallet} from "./wallet.js"
import CryptoApiClient from "./CryptoApi.js"
import { createNonceGenerator } from "../utils/helpers.js";

let myClient = new CryptoApiClient();
const myWallet = new Wallet("test_string", myClient);

function main() {
    
    try {
        myWallet.deposit(100, 'ethereum')
        myWallet.pay(5, 'ethereum', '0x123123123dda123123123dda123123123ddafbd4')
        } 
        catch(error) {
            if(error instanceof InsufficientFundsError) {
                console.error("Insufficient funds ", error.amount - error.balance, error.message)
            }
            else if(error instanceof InvalidAmountError) {
                console.error("Invalid amount ", error.amount, error.message)
            }
            else if(error instanceof InvalidAddressError) {
                console.error("Invalid address", error.address, error.message)
            }
            else if(error instanceof ApiNetworkError) {
                console.error("API network error", error.statusText, error.statusCode)
            }
        }
        
}

main();

try {
    myWallet.deposit(100, 'Ethereum')
    myWallet.deposit(50, 'BTC')
    myWallet.pay(40, 'Btc', '0x123123123dda123123123dda123123123ddafbd4')
    myWallet.pay(30, 'ethereum', '0x123123123dda123123123dda123123123ddafbd4')
    myWallet.deposit(60, 'solana')
} 
catch(error) {
    console.error(error.message)
}


for (const chunk of myWallet.getTransactionChunks(2)) {
    console.log(chunk)
}





