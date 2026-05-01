const fetch = require('node-fetch')
const logService = require('../services/logs/logService')

class CafciApiClient {
    constructor() { }

    async getFciQuote(fondo, clase) {
        const requestOptions = {
            method: 'GET',
            headers: {
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'es-419,es;q=0.9',
                'origin': 'https://www.cafci.org.ar',
                'priority': 'u=1, i',
                'referer': 'https://www.cafci.org.ar/',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
            }
        }
        try {
            const response = await fetch(`https://api.pub.cafci.org.ar/fondo/${fondo}/clase/${clase}/ficha`, requestOptions)
            if (response.status !== 200) {
                throw new Error(`Error fetching FCI quote: ${response.statusText}`)
            }
            const data = await response.json()
            return data.data.info.diaria.actual.vcpUnitario
        } catch (error) {
            logService.createNewMessage("Hubo un error haciendo fetch en CafciApiClient.getFciQuote. Error: " + error.message)
            return 0
        }
    }
}

const cafciApiClientInstance = new CafciApiClient()

module.exports = cafciApiClientInstance