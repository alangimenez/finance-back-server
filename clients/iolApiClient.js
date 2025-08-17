const fetch = require('node-fetch')
const { IOL_USER, IOL_PASSWORD } = require('../config/config.environments')
const userDao = require('../repository/daos/user/userDao')

class IolApiClient{
    constructor(){}

    async getOnQuotes(token) {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }
        const quotesResponse = await fetch(`https://api.invertironline.com/api/v2/Cotizaciones/obligacionesNegociables/argentina/Todos`, requestOptions)
        await this.#incrementCounter()
        return await quotesResponse.json() 
    }

    async getAdrQuotes(token) {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }
        const quotesResponse = await fetch(`https://api.invertironline.com/api/v2/Cotizaciones/aDRs/estados_Unidos/Todos`, requestOptions)
        await this.#incrementCounter()
        return await quotesResponse.json() 
    }

    async getPublicBondsQuotes(token) {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }
        const quotesResponse = await fetch(`https://api.invertironline.com/api/v2/Cotizaciones/bonos/bCBA/argentina`, requestOptions)
        await this.#incrementCounter()
        return await quotesResponse.json() 
    }

    async getStocksArgentinaQuotes(token) {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }
        const quotesResponse = await fetch(`https://api.invertironline.com/api/v2/Cotizaciones/Acciones/Argentina/Todos`, requestOptions)
        await this.#incrementCounter()
        return await quotesResponse.json() 
    }

    async getCedearQuotes(token) {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }
        const quotesResponse = await fetch(`https://api.invertironline.com/api/v2/Cotizaciones/Acciones/estados_Unidos/Todos?cotizacionInstrumentoModel.instrumento=cedears&cotizacionInstrumentoModel.pais=argentina`, requestOptions)
        await this.#incrementCounter()
        return await quotesResponse.json() 
    }

    async getVistaStockEeuuQuotes(token) {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }
        const quotesResponse = await fetch(`https://api.invertironline.com/api/v2/nYSE/Titulos/VIST/CotizacionDetalle`, requestOptions)
        await this.#incrementCounter()
        return await quotesResponse.json() 
    }

    async getRefreshTokenFromIol(refreshToken) {
        const tokenResponse = await fetch(
            `https://api.invertironline.com/token`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    refresh_token: refreshToken,
                    grant_type: "refresh_token"
                })
            }
        )
        await this.#incrementCounter()
        return await tokenResponse.json()
    }

    async getAccessTokenFromIol() {
        const tokenResponse = await fetch(
            `https://api.invertironline.com/token`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    username: IOL_USER,
                    password: IOL_PASSWORD,
                    grant_type: "password"
                })
            }
        )
        await this.#incrementCounter()
        return await tokenResponse.json()
    }

    async #incrementCounter() {
        const userData = await userDao.getUser("IOL")
        await userDao.incrementCounter(userData[0].counter + 1)
        return
    }
}

const iolApiClient = new IolApiClient()

module.exports = iolApiClient