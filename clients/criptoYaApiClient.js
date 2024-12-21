const fetch = require('node-fetch')

class CriptoYaApiClient {
    constructor(){}

    async getDollarData() {
        const response = await fetch('https://criptoya.com/api/dolar')
        return await response.json()
    }

    async getEthereumQuote() {
        const ethereumResponse = await fetch(`https://criptoya.com/api/ETH/USD/0.1`)
        const ethereumData = await ethereumResponse.json()
        return ethereumData.banexcoin.bid
    }

    async getBitcoinQuote() {
        const bitcoinResponse = await fetch(`https://criptoya.com/api/BTC/USD/0.1`)
        const bitcointData = await bitcoinResponse.json()
        return bitcointData.banexcoin.bid
    }
}

const criptoYaApiClient = new CriptoYaApiClient()

module.exports = criptoYaApiClient