const mercadoPagoRepository = require('../../repository/daos/periods/mercadoPagoDao')
const { convertRequest, addOneMonth, addOneYear, getMonthAndYearFromDate } = require('../../utils/utils')

class MercadoPagoService {
    constructor() { }

    async createNewPeriod(request) {
        const dataNewPeriod = convertRequest(request)
        const lastPeriod = await mercadoPagoRepository.getLastPeriod()

        const newPeriod = {
            "month": addOneMonth(lastPeriod[0].month),
            "year": addOneYear(+lastPeriod[0].year, lastPeriod[0].month),
            "discountTotal": dataNewPeriod.total,
            "discountConsumed": 0,
            "discounts": []
        }

        const result = await mercadoPagoRepository.subirInfo(newPeriod)

        return result
    }

    async getLastPeriod() {
        return await mercadoPagoRepository.getLastPeriod()
    }

    async uploadBatchExpense(request) {
        const batchOfExpenses = convertRequest(request)

        let benefitMP = 1
        if (batchOfExpenses.benefitMP) {benefitMP = 0.3}

        const discountConsumedOfMonth = await mercadoPagoRepository.getLastPeriod()
        const date = getMonthAndYearFromDate(batchOfExpenses.date)
        let total = 0
        batchOfExpenses.expenses.map(it => {
            const eachRegister = {
                "date": batchOfExpenses.date,
                "debit": it.debtAccount,
                "debitCurrency": batchOfExpenses.currency,
                "debitAmount": (+it.debtAmount - +it.discountAmount) * benefitMP,
                "credit": batchOfExpenses.credit,
                "creditCurrency": batchOfExpenses.currency,
                "creditAmount": (+it.debtAmount - +it.discountAmount) * benefitMP,
                "comments": batchOfExpenses.comments
            }
            mercadoPagoRepository.uploadNewExpense(date.month, date.year, eachRegister)
            total = total + eachRegister.debitAmount
        })
        
        await mercadoPagoRepository.updateDiscountConsumed(date.month, date.year, discountConsumedOfMonth[0].discountConsumed + total)
        return {"message": "ok"}
    }
}

const mercadoPagoService = new MercadoPagoService()

module.exports = mercadoPagoService