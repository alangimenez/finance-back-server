const investmentRepository = require('../../repository/daos/investments/investmentDao');
const lastValueService = require('./lastValueService');
const assetTypeService = require('../accounts/assetTypeService');
const otherQuotesService = require('./otherQuotesService');
const { convertRequest } = require('../../utils/utils');

class InvestmentService {
    constructor() { }

    async saveInvestment(request) {
        let investment = convertRequest(request)

        switch (investment.operation) {
            case "Buy":
                await this.operationBuy(investment)
                break;
            case "Sell":
                await this.operationSell(investment)
                break;
            default:
                break
        }

        return ({ "message": "ok" })
    }

    async getInvestments() {
        const investments = await investmentRepository.leerInfo()
        const investmentsResponse = []

        investments.map((e) => {
            investmentsResponse.push({
                ...e._doc,
                operationQuantity: e.operationQuantity,
                operationPrice: e.operationPrice,
                actualQuantity: e.actualQuantity,
                commission: e.commission
            })
        })
        return investmentsResponse
    }

    async getPortfolio() {
        const operations = await investmentRepository.getRemainingOperations()
        const lastValuePortfolio = await lastValueService.getAll()
        const assetTypeDetail = await assetTypeService.getAllAssetType()
        const dollars = await otherQuotesService.getLastQuote()

        // agrupa las operaciones en una sola tenencia
        const portfolio = []
        operations.map(operation => {
            const i = portfolio.findIndex(asset => asset.ticket == operation.ticket)
            if (i >= 0) {
                portfolio[i].actualQuantity = +portfolio[i].actualQuantity + +operation.actualQuantity.toString()
            } else {
                portfolio.push(operation)
            }
        })

        const response = []
        for (let i = 0; i < portfolio.length; i++) {
            const key = lastValuePortfolio.findIndex(register => register.ticket == portfolio[i].ticket)
            if (key >= 0) {
                const newElement = {
                    ...portfolio[i]._doc,
                    'actualPrice': lastValuePortfolio[key].price
                }
                response.push(newElement)
            }
        }

        const subtotalByAssetType = []
        assetTypeDetail.map(atp => {
            const assetsMatching = response.filter(a => a.assetType == atp.assetType)
            let valueAssetType = 0
            if (assetsMatching.length > 0) {
                assetsMatching.map(am => {
                    valueAssetType = valueAssetType + (am.actualQuantity * am.actualPrice)
                })
            }
            if (valueAssetType > 0) {
                const typeOfAsset = {
                    "assetType": atp.assetType,
                    "subtotal": +valueAssetType
                }
                subtotalByAssetType.push(typeOfAsset)
            }
        })
        let totalByAssetType = 0
        subtotalByAssetType.map(sbat => {
            totalByAssetType = totalByAssetType + sbat.subtotal
        })
        const subtotalByAssetTypeWithPercent = []
        subtotalByAssetType.map(sbat => {
            subtotalByAssetTypeWithPercent.push({
                ...sbat,
                "percentage": sbat.subtotal / totalByAssetType
            })
        })

        const detailByAssetType = []
        assetTypeDetail.map(atp => {
            let value = 0
            let subDetail = []
            atp.assets.map(atpdetail => {
                const assetMatch = response.filter(a => a.ticket == atpdetail)
                if (assetMatch.length > 0) {
                    assetMatch.map(asset => {
                        value = value + (asset.actualQuantity * asset.actualPrice)
                        // console.log(asset)
                        const element = {
                            "ticket": asset.ticket,
                            "currency": asset.operationCurrency,
                            "quantity": asset.actualQuantity,
                            "subtotal": value,
                            "percentageOverTotal": value / totalByAssetType
                        }
                        if (asset.operationCurrency == "USD") {
                            element['priceUsdBna'] = value
                            element['priceUsdMep'] = value
                            element['priceArsBna'] = value * dollars.quotes.dolarBnaComprador
                            element['priceArsMep'] = value * dollars.quotes.dolarMep
                        } else {
                            element['priceUsdBna'] = value / dollars.quotes.dolarBnaVendedor
                            element['priceUsdMep'] = value / dollars.quotes.dolarMep
                            element['priceArsBna'] = value
                            element['priceArsMep'] = value
                        }
                        subDetail.push(element)
                        value = 0
                    })
                }
            })
            if (subDetail.length > 0) {
                const newElement = {
                    "value": atp.assetType,
                    "subdetail": subDetail
                }
                detailByAssetType.push(newElement)
            }
        })

        detailByAssetType.map(dbat => {
            let subtotalUsdBna = 0
            let subtotalArsBna = 0
            let subtotalUsdMep = 0
            let subtotalArsMep = 0
            dbat.subdetail.map(dbatch => {
                subtotalUsdBna = subtotalUsdBna + dbatch.priceUsdBna
                subtotalArsBna = subtotalArsBna + dbatch.priceArsBna
                subtotalUsdMep = subtotalUsdMep + dbatch.priceUsdMep
                subtotalArsMep = subtotalArsMep + dbatch.priceArsMep
            })
            const k = subtotalByAssetTypeWithPercent.findIndex(at => at.assetType == dbat.value)
            subtotalByAssetTypeWithPercent[k]['usdBna'] = subtotalUsdBna
            subtotalByAssetTypeWithPercent[k]['arsBna'] = subtotalArsBna
            subtotalByAssetTypeWithPercent[k]['usdMep'] = subtotalUsdMep
            subtotalByAssetTypeWithPercent[k]['arsMep'] = subtotalArsMep
        })

        const finalResponse = {
            "totalDetail": subtotalByAssetTypeWithPercent,
            "total": totalByAssetType,
            "detail": detailByAssetType
        }

        return finalResponse
    }

    // PRIVATE

    async operationBuy(register) {
        register = {
            ...register,
            "actualQuantity": register.operationQuantity
        }
        await investmentRepository.subirInfo(register)
    }

    async operationSell(register) {
        const operations = await investmentRepository.getOperationsByTicket(register.ticket);
        operations.sort((a, b) => a.operationDate - b.operationDate);
        let remainingQuantity = register.operationQuantity

        // TODO: consider when operationQuantity is greater than actualQuantity as a new error
        for (let i = 0; i < operations.length; i++) {
            if (remainingQuantity > operations[i].actualQuantity) {
                await investmentRepository.updateInvestmentRegister(operations[i]._id, 0);
                remainingQuantity = remainingQuantity - operations[i].actualQuantity;
            } else {
                await investmentRepository.updateInvestmentRegister(operations[i]._id, operations[i].actualQuantity - remainingQuantity);
                remainingQuantity = 0
            }
        }
        await investmentRepository.subirInfo(register)
    }
}

const investmentService = new InvestmentService()

module.exports = investmentService