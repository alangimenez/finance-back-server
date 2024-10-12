const quotesRepository = require('../../repository/daos/investments/quotesDao')
const userService = require('../user/userService')
const Quote = require('../../models/quote');
const QuotesModel = require('../../models/model/quotesModel')
const iolApiClient = require('../../clients/iolApiClient')
const { getActualDayInZero } = require('../../utils/utils')
const cashflowRepository = require('../../repository/daos/investments/cashflowDao');
const accountService = require('../accounts/accountService');
const logService = require('../logs/logService.js')

class QuotesService {
    constructor() { }

    async deleteAllQuotesByBondName(bondName) {
        return await quotesRepository.eliminarTodos(bondName);
    }

    async saveInfo(response) {
        let arrayQuotes;
        if (typeof (response) == 'string') {
            arrayQuotes = JSON.parse(response)
            arrayQuotes = arrayQuotes.quotes
        } else {
            arrayQuotes = response
        }

        // convert response in model for persist in DB
        const tiempoTranscurrido = Date.now();
        const hoy = new Date(tiempoTranscurrido);
        let arrayQuotesToPersist = []
        for (let i = 0; i < arrayQuotes.length; i++) {
            arrayQuotes[i].lastPrice = arrayQuotes[i].lastPrice.replace(".", "")
            arrayQuotes[i].lastPrice = arrayQuotes[i].lastPrice.replace(",", ".")
            arrayQuotes[i].value = arrayQuotes[i].value.replace(".", "")
            arrayQuotes[i].value = arrayQuotes[i].value.replace(",", ".")
            arrayQuotes[i].volumen = arrayQuotes[i].volumen.replace(".", "")
            arrayQuotes[i].volumen = arrayQuotes[i].volumen.replace(",", ".")
            const quote = new Quote(
                arrayQuotes[i].name,
                hoy.toLocaleDateString(),
                hoy.toLocaleTimeString(),
                parseFloat(arrayQuotes[i].value),
                parseFloat(arrayQuotes[i].lastPrice),
                parseFloat(arrayQuotes[i].volumen)
            )
            arrayQuotesToPersist.push(quote)
        }

        // save info
        quotesRepository.subirInfo({
            "date": hoy.toLocaleDateString(),
            "time": hoy.toLocaleTimeString(),
            "quotes": arrayQuotesToPersist
        })

        // response
        return { "message": "ok" }
    }

    async saveInfoFromIol() {
        const token = await userService.getAccessTokenToOperateIol()
        const uploadedBonds = await cashflowRepository.leerInfo()
        const listOfUploadedBonds = this.#getListOfUploadedBonds(uploadedBonds)
        const stocksWithBalance = await accountService.getTicketsByAssetTypeWithBalanceGreatherThanZero("Stocks")
        const cedearsWithBalance = await await accountService.getTicketsByAssetTypeWithBalanceGreatherThanZero("CEDEAR")

        const onQuotes = await iolApiClient.getOnQuotes(token)
        const adrQuotes = await iolApiClient.getAdrQuotes(token)
        const publicBondsQuotes = await iolApiClient.getPublicBondsQuotes(token)
        const stocksArgentinaQuotes = await iolApiClient.getStocksArgentinaQuotes(token)
        const vistaEeuuStockQuote = await iolApiClient.getVistaStockEeuuQuotes(token)
        const cedearsQuotes = await iolApiClient.getCedearQuotes(token)

        vistaEeuuStockQuote.type = "StocksEeuu"

        const onQuotesTransformed = this.#transformQuotes(onQuotes.titulos, listOfUploadedBonds, "ON")
        const adrQuotesTransformed = this.#transformQuotes(adrQuotes.titulos, listOfUploadedBonds, "ADR")
        const publicBondsQuotesTransformed = this.#transformQuotes(publicBondsQuotes.titulos, listOfUploadedBonds, "Bono Público")
        const stocksTransformed = this.#transformQuotes(stocksArgentinaQuotes.titulos, stocksWithBalance, "Stocks")
        const cedearTransformed = this.#transformQuotes(cedearsQuotes.titulos, cedearsWithBalance, "CEDEAR")

        const allQuotes = [...onQuotesTransformed, ...adrQuotesTransformed, ...publicBondsQuotesTransformed, ...stocksTransformed, vistaEeuuStockQuote, ...cedearTransformed]
        const quotes = new QuotesModel(getActualDayInZero(), allQuotes)

        try {
            await quotesRepository.subirInfo(quotes)
        } catch (error) {
            logService.createNewMessage("Hubo un error guardando las cotizaciones en Quotes. QuotesService/saveInfoFromIol")
        }

        return allQuotes
    }

    #getListOfUploadedBonds(uploadedBonds) {
        const listOfUploadedBonds = []
        uploadedBonds.forEach(value => {
            listOfUploadedBonds.push(value.ticket)
        })
        return listOfUploadedBonds
    }

    #transformQuotes(assets, listOfFilter, type) {
        const filteredAssets = this.#getAssetsFiltered(assets, listOfFilter)
        const assetsWithType = this.#addTypeInvestment(filteredAssets, type)
        return assetsWithType
    }

    #getAssetsFiltered(assets, listOfFilter) {
        return assets.filter(it => listOfFilter.includes(it.simbolo))
    }

    #addTypeInvestment(assets, type) {
        const assetsWithType = []
        assets.forEach(asset => {
            const assetWithType = {
                ...asset,
                type: type
            }
            assetsWithType.push(assetWithType)
        })
        return assetsWithType
    }
}

const quotesService = new QuotesService()

module.exports = quotesService