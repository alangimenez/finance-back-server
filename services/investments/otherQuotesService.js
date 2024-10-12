const otherQuotesDao = require('../../repository/daos/investments/otherQuotesDao')
const coinGeckoApiClient = require('../../clients/coinGeckoApiClient')
const criptoYaApiClient = require('../../clients/criptoYaApiClient')
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
        const dateForCriptoFetch = moment(lastQuotesDate).add(24, 'hours').format('DD-MM-YYYY')

        const dollarData = await criptoYaApiClient.getDollarData()
        const ethereumQuote = await coinGeckoApiClient.getEthereumQuoteByDate(dateForCriptoFetch)
        const litecoinQuote = await coinGeckoApiClient.getLitecoinQuoteByDate(dateForCriptoFetch)
        const bitcoinQuote = await coinGeckoApiClient.getBitcoinQuoteByDate(dateForCriptoFetch)

        let quotes = ""
        try {
            quotes = new OtherQuotesModel(
                dollarData.oficial.price,
                dollarData.oficial.price - (dollarData.oficial.price * 0.045),
                dollarData.mep.al30["24hs"].price,
                ethereumQuote,
                litecoinQuote,
                bitcoinQuote
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
        const actualPrices = await coinGeckoApiClient.getActualPriceCriptos()
        return {
            bitcoin: {
                actual: actualPrices.bitcoin.usd,
                lastDay: quotesLastDay[0].quotes.bitcoin
            },
            ethereum: {
                actual: actualPrices.ethereum.usd,
                lastDay: quotesLastDay[0].quotes.ethereum
            },
            litecoin: {
                actual: actualPrices.litecoin.usd,
                lastDay: quotesLastDay[0].quotes.litecoin
            }
        }
    }
}

const otherQuotesService = new OtherQuotesService()

module.exports = otherQuotesService