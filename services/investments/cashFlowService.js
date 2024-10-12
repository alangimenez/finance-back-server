const cashFlowRepository = require('../../repository/daos/investments/cashflowDao');
const { diffInDaysBetweenDateAndToday, transformDate, roundToTwo } = require('../../utils/utils');
const investmentService = require('./investmentService');

class CashFlowService {
    constructor() { }
    async getCashFlow() {
        return await cashFlowRepository.leerInfo()
    }

    async saveCashFlow(cashFlow) {

        const dateOfPayments = []
        cashFlow.dateOfPayment.map(dop => dateOfPayments.push(new Date(dop)))

        return await cashFlowRepository.subirInfo({
            "ticket": cashFlow.ticket,
            "company": cashFlow.company,
            "start": cashFlow.start,
            "finish": cashFlow.finish,
            "rate": cashFlow.rate,
            "dateOfPayment": dateOfPayments,
            "amountInterest": cashFlow.amountInterest,
            "amountAmortization": cashFlow.amountAmortization
        })
    }

    async getAllCashFlowSorted() {
        const cashFlows = await cashFlowRepository.leerInfo()
        const flowOfInterest = []

        cashFlows.map((bond) => {
            for (let i = 0; i < bond.dateOfPayment.length; i++) {
                flowOfInterest.push({
                    ticket: bond.ticket,
                    dateOfPayment: bond.dateOfPayment[i],
                    amountInterest: bond.amountInterest[i],
                    amortizationInterest: bond.amountAmortization[i],
                    remainingsDays: diffInDaysBetweenDateAndToday(bond.dateOfPayment[i])
                })
            }
        })

        const investments = await investmentService.getInvestments()
        const response = []

        // order by date, consider actualQuantity, delete old flows of money and delete flows that aren't in portfolio
        flowOfInterest.sort((a, b) => a.dateOfPayment - b.dateOfPayment)
        flowOfInterest.map((interest) => {
            const index = investments.findIndex(asset => asset.ticket == interest.ticket)
            if (interest.remainingsDays >= 0 && index >= 0) {
                interest.dateInterest = transformDate(interest.dateOfPayment)
                interest.amortizationInterest = roundToTwo(interest.amortizationInterest * investments[index].actualQuantity / 100)
                interest.amountInterest = roundToTwo(interest.amountInterest * investments[index].actualQuantity / 100)
                response.push(interest)
            }
        })

        return (response)
    }
}

const cashFlowService = new CashFlowService()

module.exports = cashFlowService