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

        const dollarData = await criptoYaApiClient.getDollarData()
        const ethereumQuote = await coinGeckoApiClient.getEthereumQuoteByDate()
        const bitcoinQuote = await coinGeckoApiClient.getBitcoinQuoteByDate()

        let quotes = ""
        try {
            quotes = new OtherQuotesModel(
                dollarData.oficial.price,
                dollarData.oficial.price - (dollarData.oficial.price * 0.045),
                dollarData.mep.al30["24hs"].price,
                ethereumQuote,
                0,
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

        const bitcoinPrice = await coinGeckoApiClient.getBitcoinQuoteByDate()
        const ethereumPrice = await coinGeckoApiClient.getEthereumQuoteByDate()

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
}

const otherQuotesService = new OtherQuotesService()

module.exports = otherQuotesService