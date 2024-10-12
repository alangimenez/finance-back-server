const fetch = require('node-fetch')

class CriptoYaApiClient {
    constructor(){}

    async getDollarData() {
        const response = await fetch('https://criptoya.com/api/dolar')
        return await response.json()
    }
}

const criptoYaApiClient = new CriptoYaApiClient()

module.exports = criptoYaApiClient