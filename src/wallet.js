Array.prototype.getLastTx = function() {
		return this[this.length -1]
	}

class Wallet {
	#privateKey = undefined
	#balance = undefined
	address = undefined
	#transactions = undefined
	
	constructor(_privateKey) {
		if(_privateKey) {
			this.#privateKey = _privateKey;
		} //else this.#privateKey = random string logic
		
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
} 


