const lastValueRepository = require('../../repository/daos/investments/lastValueDao.js');
const tirRepository = require('../../repository/daos/investments/tirDao');
const otherQuotesService = require('./otherQuotesService.js')
const quotesService = require('./quotesService.js')
const logService = require('../logs/logService.js')
const Quote = require('../../models/quote');
const { convertRequest } = require('../../utils/utils')
const moment = require('moment'); // require
moment().format();

class LastValueService {
    constructor() {}

    async deleteAll() {
        await lastValueRepository.eliminarTodos()
    }

    async deleteByBondName(bondName) {
        await lastValueRepository.eliminarPorBondname(bondName)
    }

    async saveInfo(response) {
        let arrayQuotes;
        if (typeof(response) == 'string') {
            arrayQuotes = JSON.parse(response)
            arrayQuotes = arrayQuotes.quotes
        } else {
            arrayQuotes = response
        }

        const bonds = await lastValueRepository.leerInfo()

        const tiempoTranscurrido = Date.now();
        const hoy = new Date(tiempoTranscurrido);

        for (let i = 0; i < arrayQuotes.length; i++) {
            const indexBond = bonds.findIndex((e) => e.ticket == arrayQuotes[i].ticket)
            console.log(indexBond)
            if (indexBond >= 0) {
                arrayQuotes[i].price = arrayQuotes[i].price.replace(".","")
                arrayQuotes[i].price = arrayQuotes[i].price.replace(",",".")
                arrayQuotes[i].volumen = arrayQuotes[i].volumen.replace(".","")
                arrayQuotes[i].volumen = arrayQuotes[i].volumen.replace(",",".")

                if (arrayQuotes[i].price != bonds[indexBond].price || 
                    arrayQuotes[i].volumen != bonds[indexBond].volumen) {
                        lastValueRepository.modifyValues(arrayQuotes[i])
                }
            } else {
                arrayQuotes[i].price = arrayQuotes[i].price.replace(".","")
                arrayQuotes[i].price = arrayQuotes[i].price.replace(",",".")
                arrayQuotes[i].volumen = arrayQuotes[i].volumen.replace(".","")
                arrayQuotes[i].volumen = arrayQuotes[i].volumen.replace(",",".")
                const quote = new Quote(
                    arrayQuotes[i].ticket,
                    hoy.toLocaleString(),
                    parseFloat(arrayQuotes[i].price),
                    parseFloat(arrayQuotes[i].volumen)
                )
    
                // guardado de información
                lastValueRepository.subirInfo(quote)
            }
        }
        return {"message": "ok"}
    }

    async getInfoByBondName(bondName) {
        const result =  await lastValueRepository.leerInfoPorBondname(bondName);
        return result[0]
    }

    async getAll() {
        let lastValues = await lastValueRepository.leerInfo()

        const usdMep = lastValues[0].otherQuotes.quotes.dolarMep
        let bondQuotes = this.#convertBondModelToBondResponse(lastValues[0].quotes, usdMep)
        
        return bondQuotes
    }

    async getQuotesWithTir() {
        const quotes = await lastValueRepository.leerInfo();
        const tir = await tirRepository.leerInfo();
        const quotesResponse = []
        for (let i = 0; i < quotes.length; i++) {
            const index = tir.findIndex((e) => e.bondName == quotes[i].bondName);
            if (index >= 0) {
                quotesResponse.push({
                    "bondName" : quotes[i].bondName,
                    "date": quotes[i].date,
                    "time": quotes[i].time,
                    "lastPrice": +quotes[i].lastPrice.toString(),
                    "closePrice": +quotes[i].closePrice.toString(),
                    "volume": +quotes[i].volume.toString(),
                    "tir": +tir[index].tir.toString()
                })
            }
        }
        return quotesResponse
    }

    async saveManualQuote(request) {
        const quote = convertRequest(request)

        const tiempoTranscurrido = Date.now();
        const hoy = new Date(tiempoTranscurrido);
        quote.date = hoy.toLocaleString()

        const lastValueQuote = await lastValueRepository.getQuotesByTicket(quote.ticket)
        if (lastValueQuote.length > 0) {
            lastValueRepository.modifyValues(quote)
        } else {
            lastValueRepository.subirInfo(quote)
        }

        return ({"message": "ok"})
    }

    async saveQuotesAndOtherQuotes() {
        const lastValue = await this.#buildLastValue()

        const lastRegister = await lastValueRepository.getLastRegister()
        await lastValueRepository.deleteLastRegister(lastRegister._id)
        await lastValueRepository.subirInfo(lastValue)

        logService.createNewMessage("El relevamiento diario de cotizaciones finalizó con éxito a las : " + new Date())

        return
    }

    async getQuotesInRealTime() {
        return await this.#buildLastValue()
    }

    async #buildLastValue() {
        const quotes = await quotesService.saveInfoFromIol()
        const otherQuotes = await otherQuotesService.uploadNewQuote()

        return {
            date: new Date(),
            quotes: quotes,
            otherQuotes: otherQuotes
        }
    }

    #getLastPriceInUsd(price, currency, usd) {
        if (currency == "US$" || currency == "2") {
            return price
        } else {
            return price / usd
        }
    }

    #convertBondModelToBondResponse(bondModelList, usd) {
        const bondResponseList = []
        for (let i = 0; i < bondModelList.length; i++) {
            const bond = bondModelList[i]
            bondResponseList.push({
                ticket: bond.simbolo,
                price: this.#getLastPriceInUsd(bond.ultimoPrecio, bond.moneda, usd)
            })
        }
        return bondResponseList
    }
}

const lastValueService = new LastValueService()

module.exports = lastValueService