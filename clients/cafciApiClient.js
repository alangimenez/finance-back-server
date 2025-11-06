const fetch = require('node-fetch')

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
            return await response.json()
        } catch (error) {
            throw new Error(`Error fetching FCI quote: ${error.message}`)
        }
    }
}

const cafciApiClientInstance = new CafciApiClient()

module.exports = cafciApiClientInstance