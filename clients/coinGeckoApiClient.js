const fetch = require('node-fetch')

class CoinGeckoApiClient {
    constructor(){}

    async getEthereumQuoteByDate() {
        /* const ethereumResponse = await fetch(`https://api.coingecko.com/api/v3/coins/ethereum/history?date=${date}`)
        const ethereumData = await ethereumResponse.json()
        return ethereumData.market_data.current_price.usd */
        const ethereumResponse = await fetch(`https://criptoya.com/api/ETH/USD/0.1`)
        const ethereumData = await ethereumResponse.json()
        return ethereumData.banexcoin.bid
    }

    async getLitecoinQuoteByDate() {
        /* const litecoinResponse = await fetch(`https://api.coingecko.com/api/v3/coins/litecoin/history?date=${date}`)
        const litecointData = await litecoinResponse.json()
        return litecointData.market_data.current_price.usd */
    }

    async getBitcoinQuoteByDate() {
        /* const bitcoinResponse = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/history?date=${date}`)
        const bitcointData = await bitcoinResponse.json()
        return bitcointData.market_data.current_price.usd */
        const bitcoinResponse = await fetch(`https://criptoya.com/api/BTC/USD/0.1`)
        const bitcointData = await bitcoinResponse.json()
        return bitcointData.banexcoin.bid
    }

    async getActualPriceCriptos() {
        /* const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin&vs_currencies=usd`)
        const data = await response.json()
        return data */
    }
}

const coinGeckoApiClient = new CoinGeckoApiClient()

module.exports = coinGeckoApiClient