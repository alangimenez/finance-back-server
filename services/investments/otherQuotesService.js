const otherQuotesDao = require('../../repository/daos/investments/otherQuotesDao')
const criptoYaApiClient = require('../../clients/criptoYaApiClient')
const cafciApiClient = require('../../clients/cafciApiClient')
const logService = require('../logs/logService')
const OtherQuotesModel = require('../../models/model/otherQuotesModel')
const { addDays } = require('../../utils/utils')
const moment = require('moment');
moment().format();

class OtherQuotesService {
    constructor() { }

    async uploadNewQuote() {
        const lastQuote = await otherQuotesDao.getLastQuote()
        const lastQuotesDate = lastQuote[0].date

        const dollarData = await criptoYaApiClient.getDollarData()
        const ethereumQuote = await criptoYaApiClient.getEthereumQuote()
        const bitcoinQuote = await criptoYaApiClient.getBitcoinQuote()
        const fciAccionesResponse = await cafciApiClient.getFciQuote(406, 730)
        const fciLiquidoResponse = await cafciApiClient.getFciQuote(519, 1048)
        const fciAcciones = parseFloat(fciAccionesResponse.data.info.diaria.actual.vcpUnitario)
        const fciLiquido = parseFloat(fciLiquidoResponse.data.info.diaria.actual.vcpUnitario)

        let quotes = ""
        try {
            quotes = new OtherQuotesModel(
                dollarData.oficial.price,
                dollarData.oficial.price - (dollarData.oficial.price * 0.045),
                dollarData.mep.al30["24hs"].price,
                ethereumQuote,
                0,
                bitcoinQuote,
                fciAcciones,
                fciLiquido
            )
        } catch (error) {
            logService.createNewMessage("Hubo un error creando OtherQuotesModel en uploadNewQuotes. Error: " + error)
        }

        try {
            await otherQuotesDao.subirInfo({
                date: moment(lastQuotesDate).add(24, 'hours').toDate(),
                quotes: quotes
            })
        } catch (error) {
            logService.createNewMessage("Hubo un error guardando otherQuotes en uploadNewQuotes. Error: " + error)
        }
        
        return { quotes: quotes }
    }

    async getLastQuote() {
        const lastQuote = await otherQuotesDao.getLastQuote()

        return ({
            ...lastQuote[0]._doc,
            "proxDate": addDays(lastQuote[0].date),
            "date": moment(lastQuote[0].date).add(12, 'hours').format('YYYY-MM-DD')
        })
    }

    async getCriptoQuotes() {
        const quotesLastDay = await otherQuotesDao.getLastQuote()

        const bitcoinPrice = await criptoYaApiClient.getBitcoinQuote()
        const ethereumPrice = await criptoYaApiClient.getEthereumQuote()

        return {
            bitcoin: {
                actual: bitcoinPrice,
                lastDay: quotesLastDay[0].quotes.bitcoin
            },
            ethereum: {
                actual: ethereumPrice,
                lastDay: quotesLastDay[0].quotes.ethereum
            }
        }
    }

    async getFciQuotes() {
        const quotesLastDay = await otherQuotesDao.getLastQuote()

        const fciLiquidoQuote = quotesLastDay[0].quotes.fciLiquido
        const fciAccionesQuote = quotesLastDay[0].quotes.fciAcciones

        return {
            fciLiquido: fciLiquidoQuote,
            fciAcciones: fciAccionesQuote
        }
    }
}

const otherQuotesService = new OtherQuotesService()

module.exports = otherQuotesService