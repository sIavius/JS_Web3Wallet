//main.js
import {Wallet, InvalidAmountError, InsufficientFundsError, InvalidAddressError} from "./wallet.js"
import CryptoApiClient from "./CryptoApi.js"

let myClient = new CryptoApiClient();
const myWallet = new Wallet("test_string", myClient);

function main() {
    myWallet.deposit(100, 'ethereum')
    console.log(myWallet.spendings, myWallet.totalVolume)
    try {
        myWallet.pay(5, 'ethereum', '0x123123123dda123123123dda123123123ddafbd4')
        //myWallet.pay(30, 'ethereum', '0x123')
        console.log(myWallet.balance)
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
        }
        
}

main();


