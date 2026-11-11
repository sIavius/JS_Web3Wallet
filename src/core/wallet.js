import { createNonceGenerator, validateEthAddress } from "../utils/helpers.js";
import { InvalidAmountError, InsufficientFundsError, InvalidAddressError } from "../utils/errors.js";

export class Wallet {
    #address;
    #transactions = [];
    #apiClient;
    #generateNonce = createNonceGenerator(-1);
    #addressBook = new Set();
    #tokenBalances = new Map();

    constructor(address, apiClient) {
        if (!validateEthAddress(address)) {
            throw new InvalidAddressError("Invalid wallet address", address);
        }

        this.#address = address;
        this.#apiClient = apiClient;
    }

    get address() {
        return this.#address;
    }

    get maskedAddress() {
        return this.address.slice(0, 6) + "..." + this.address.slice(-4);
    }

    get spendings() {
        return this.#transactions.filter(tx => tx.type === "send");
    }

    get totalVolume() {
        const volumeByCoin = this.#transactions.reduce((volume, tx) => {
            volume.set(tx.coin, (volume.get(tx.coin) ?? 0) + tx.amount);
            return volume;
        }, new Map());

        return Object.fromEntries(volumeByCoin);
    }

    get addressBookSize() {
        return this.#addressBook.size;
    }

    findTransactionById(id) {
        return this.#transactions.find(tx => tx.id === id);
    }

    async getTokenValue(coin) {
        const coinId = coin.toLowerCase();
        const rates = await this.#apiClient.fetchRates(coinId);
        return this.getTokenBalance(coinId) * (rates[coinId]?.usd ?? 0);
    }

    deposit(amount, coin) {
        const coinId = coin.toLowerCase();
        const balance = this.getTokenBalance(coinId);
        if (!Number.isFinite(amount) || amount <= 0) {
            throw new InvalidAmountError("Invalid deposit amount", amount, balance);
        }

        this.setTokenBalance(coinId, balance + amount);
        return this.#recordTransaction({ type: "receive", amount, coin: coinId });
    }

    pay(amount, coin, address) {
        const coinId = coin.toLowerCase();
        const balance = this.getTokenBalance(coinId);
        if (!validateEthAddress(address)) {
            throw new InvalidAddressError("Invalid recipient address", address);
        }

        if (!Number.isFinite(amount) || amount <= 0) {
            throw new InvalidAmountError("Invalid payment amount", amount, balance);
        }

        if (balance < amount) {
            throw new InsufficientFundsError("Insufficient funds", amount, balance);
        }

        this.setTokenBalance(coinId, balance - amount);
        this.#addressBook.add(address.toLowerCase());
        return this.#recordTransaction({
            type: "send",
            amount,
            coin: coinId,
            address,
            nonce: this.#generateNonce(),
        });
    }

    setTokenBalance(coin, amount) {
        if (!Number.isFinite(amount) || amount < 0) {
            throw new InvalidAmountError("Invalid balance", amount, this.getTokenBalance(coin));
        }

        this.#tokenBalances.set(coin.toLowerCase(), amount);
    }

    getTokenBalance(coin) {
        return this.#tokenBalances.get(coin.toLowerCase()) ?? 0;
    }

    *getTransactionChunks(chunkSize) {
        if (!Number.isSafeInteger(chunkSize) || chunkSize <= 0) {
            throw new RangeError("Chunk size must be a positive safe integer");
        }

        const length = this.#transactions.length;
        for (let offset = 0; offset < length; offset += chunkSize) {
            yield this.#transactions.slice(offset, Math.min(offset + chunkSize, length));
        }
    }

    #recordTransaction(details) {
        const transaction = Object.freeze({
            id: this.#transactions.length + 1,
            ...details,
            timestamp: Date.now(),
        });

        this.#transactions.push(transaction);
        return transaction;
    }
}
