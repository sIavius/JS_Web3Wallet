//wallet.js

import {createNonceGenerator, validateEthAddress} from "../utils/helpers.js"
import {InvalidAmountError, InsufficientFundsError, InvalidAddressError, ApiNetworkError} from "../utils/errors.js"

Array.prototype.getLastTx = function() { // legacy hint for studying
		return this[this.length -1]
}

export class Wallet {
	#privateKey = undefined
	//#balance = undefined
	#transactions = undefined
	#apiClient = undefined
	#generateNonce = createNonceGenerator(-1)
	#addressBook
	#tokenBalances
	address = undefined
	
	
	constructor(_privateKey, apiClient) {
		this.#apiClient = apiClient
		if(_privateKey) {
			this.#privateKey = _privateKey
		} //else this.#privateKey = random string logic
		this.#transactions = []
		//this.#balance = 0
		this.#addressBook = new Set()
		this.#tokenBalances = new Map()
	}

	get maskedAddress() {
		return this.address.slice(0, 6) + "..." + this.address.slice(-4);
	}

	get spendings() {
		return this.#transactions.filter(tx => tx.type === "send");
	}

	get totalVolume() {
		return this.#transactions.reduce((acc, tx) => 
			{	
				acc[tx.coin] = (acc[tx.coin] ?? 0) + Math.abs(tx.amount ?? 0);
				return acc;
			}, {})
	}

	get addressBookSize() {
		return this.#addressBook.size
	}

	findTransactionsByHash(query) {
		return this.#transactions.filter(tx => (tx.hash.startsWith(query) || tx.hash.endsWith(query)))
	}

	async getTokenValue(coin) {
		coin = coin.toLowerCase()
		try {
			const rates = await this.#apiClient.fetchRates(coin)
			//this.setTokenBalance = rates[coin]?.usd ?? this.getTokenBalance(coin);
			return this.getTokenBalance(coin) * (rates[coin]?.usd ?? 0)
		}
		catch(error) {
			console.error("Balance update error ", error.message);
			throw error;
		}
	}
	

	deposit(amount, coin) {
		coin = coin.toLowerCase()
		if(amount <= 0 || !Number.isFinite(amount)) {
			throw new InvalidAmountError("Amount incorrect", amount, this.getTokenBalance(coin))
		}
		const currentBalance = this.getTokenBalance(coin)
		const newBalance = currentBalance + amount
		this.setTokenBalance(coin, newBalance)
		//this.#balance += amount;
		this.#transactions.push({
			type: 'receive',
			amount: amount,
			coin: coin,
			timestamp: Date.now()
		})
	}

	pay(amount, coin, address) {
		coin = coin.toLowerCase()
		const currentBalance = this.getTokenBalance(coin)
		if(!validateEthAddress(address)) {
			throw new InvalidAddressError("Invalid address", address)
		}

		if(amount <= 0 || !Number.isFinite(amount)) {
			throw new InvalidAmountError("Amount incorrect", amount, this.getTokenBalance(coin))
		}
		
		if(currentBalance < amount) {
			throw new InsufficientFundsError("Insufficient funds", amount, currentBalance)
		}
		
		//this.#balance -= amount;
		this.#addressBook.add(address)
		const newBalance = currentBalance - amount
		this.setTokenBalance(coin, newBalance)
		this.#transactions.push({
			type: 'send',
			amount: amount,
			coin: coin,
			timestamp: Date.now(),
			nonce: this.#generateNonce()
		})
	}
	setTokenBalance(ticker, amount) { 
		this.#tokenBalances.set(ticker, amount)
	}

	getTokenBalance(ticker) { //Map
		return this.#tokenBalances.get(ticker) ?? 0
	}

	*getTransactionChunks(chunkSize) {
		let i = 0
		let sortedTransactions = [...this.#transactions] //copying array
		.sort((a, b) => a.coin.localeCompare(b.coin))
		while(i < sortedTransactions.length) {
			yield sortedTransactions.slice(i, i + chunkSize)
			i += chunkSize
		}
	}
}



