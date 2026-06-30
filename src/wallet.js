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
} 


