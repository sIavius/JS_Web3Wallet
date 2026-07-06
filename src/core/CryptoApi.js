export default class CryptoApiClient {
    #baseUrl = 'https://api.coingecko.com/api/v3'

    async fetchRates(coin, currency="usd") {
        const response = await fetch(`${this.#baseUrl}/simple/price?ids=${coin}&vs_currencies=${currency}`)
        const data = await response.json()
        return data;
    }
}