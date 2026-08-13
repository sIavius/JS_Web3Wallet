//wallet.js
Array.prototype.getLastTx = function() { // legacy hint for studying
		return this[this.length -1]
}

import {validateEthAddress} from "../utils/helpers.js"

export class InsufficientFundsError extends Error {
	constructor(message, amount, balance) {
		super(message)
		this.name = this.constructor.name
		this.amount = amount
		this.balance = balance
	}
}

export class InvalidAmountError extends Error {
	constructor(message, amount, balance) {
		super(message)
		this.name = this.constructor.name
		this.amount = amount
		this.balance = balance
	}
}

export class InvalidAddressError extends Error {
	constructor(message, address) {
		super(message)
		this.name = this.constructor.name
		this.address = address
	}
}

export class Wallet {
	#privateKey = undefined
	#balance = undefined
	#transactions = undefined
	#apiClient = undefined
	address = undefined
	
	constructor(_privateKey, apiClient) {
		this.#apiClient = apiClient;
		if(_privateKey) {
			this.#privateKey = _privateKey;
		} //else this.#privateKey = random string logic
		this.#transactions = []
		this.#balance = 0
	}

	get balance() {
		return this.#balance;
	}

	get maskedAddress() {
		return this.address.slice(0, 6) + "..." + this.address.slice(-4);
	}

	get spendings() {
		return this.#transactions.filter(tx => tx.type === "send");
	}

	get totalVolume() {
		return this.#transactions.reduce((sum, tx) => tx.amount + sum, 0)
	}

	findTransactionsByHash(query) {
		return this.#transactions.filter(tx => (tx.hash.startsWith(query) || tx.hash.endsWith(query)))
	}

	async updateBalance(coin) {
		try {
			const rates = await this.#apiClient.fetchRates(coin);
			this.#balance = rates[coin]?.usd ?? this.#balance;
		}
		catch(error) {
			console.error("Balance update error ", error.message);
			throw error;
		}
	}

	deposit(amount, coin) {
		if(amount <= 0 || !Number.isFinite(amount)) {
			throw new InvalidAmountError("Amount incorrect", amount, this.#balance)
		}
		this.#balance += amount;
		this.#transactions.push({
			type: 'receive',
			amount: amount,
			coin: coin,
			timestamp: Date.now()
		})
	}

	pay(amount, coin, address) {
		if(!validateEthAddress(address)) {
			throw new InvalidAddressError("Invalid address", address)
		}

		if(amount <= 0 || !Number.isFinite(amount)) {
			throw new InvalidAmountError("Amount incorrect", amount, this.#balance)
		}
		
		if(this.#balance < amount) {
			throw new InsufficientFundsError("Insufficient funds", amount, this.#balance)
		}
		
		this.#balance -= amount;
		this.#transactions.push({
			type: 'send',
			amount: amount,
			coin: coin,
			timestamp: Date.now()
		})
		//createNonceGenerator(startValue) {}
}
} 


