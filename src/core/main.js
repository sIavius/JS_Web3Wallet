//main.js
import {Wallet, InvalidAmountError, InsufficientFundsError, InvalidAddressError, ApiNetworkError} from "./wallet.js"
import CryptoApiClient from "./CryptoApi.js"
import { createNonceGenerator } from "../utils/helpers.js";

let myClient = new CryptoApiClient();
const myWallet = new Wallet("test_string", myClient);

function main() {
    myWallet.deposit(100, 'ethereum')
    try {
        myWallet.pay(5, 'ethereum', '0x123123123dda123123123dda123123123ddafbd4')
        //myWallet.pay(30, 'ethereum', '0x123')
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





