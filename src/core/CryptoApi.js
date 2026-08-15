//CryptoApi.js
import {ApiNetworkError} from "./wallet.js";

export default class CryptoApiClient {
    #baseUrl = 'https://api.coingecko.com/api/v3'

    async fetchRates(coin, currency="usd") {
        const response = await fetch(`${this.#baseUrl}/simple/price?ids=${coin}&vs_currencies=${currency}`)
        if(!response.ok) {
            throw new ApiNetworkError("API request failed", response.statusText, response.status)
        }
        const data = await response.json()
        return data;
    }
}