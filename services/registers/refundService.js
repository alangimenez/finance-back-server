const refundRepository = require('../../repository/daos/registers/refundDao')
const { convertRequest } = require('../../utils/utils')
const registerService = require('./registerService')

class RefundService {
    constructor() { }

    async createExpenseWithRefund(request) {
        const expenseWithRefund = convertRequest(request)

        let benefitMP = 1
        if (expenseWithRefund.benefitMP) { benefitMP = 0.3 }

        let amount = 0
        const expenses = []
        expenseWithRefund.expenses.map((register) => {
            const eachRegister = {
                "debit": register.debtAccount,
                "debitCurrency": expenseWithRefund.currency,
                "debitAmount": (+register.debtAmount - +register.discountAmount) * benefitMP,
                "credit": expenseWithRefund.credit,
                "creditCurrency": expenseWithRefund.currency,
                "creditAmount": (+register.debtAmount - +register.discountAmount) * benefitMP,
                "comments": expenseWithRefund.comments
            }
            expenses.push(eachRegister)
            amount = amount + eachRegister.debitAmount
        })

        await refundRepository.subirInfo({
            "date": expenseWithRefund.date,
            "expenses": expenses,
            "total": amount,
            "status": "OPEN"
        })

        return ({ "message": "ok" })
    }

    async uploadRefund(request) {
        const refund = convertRequest(request)
        const id = refund.id
        delete refund.id

        await refundRepository.uploadRefundOfAnExpense(refund, id)

        const expenseOfRefund = await refundRepository.leerInfoPorId(id)
        const expenseToRegister = {
            "date": refund.date,
            "credit": expenseOfRefund[0].expenses[0].debit,
            "comments": expenseOfRefund[0].comments,
            "benefitMP": false,
            "currency": "ARS",
            "expenses": [
                {
                    "debtAccount": refund.account,
                    "discountAmount": 0,
                    "debtAmount": refund.amount
                }
            ]
        }
        
        const result = await registerService.saveBatchRegisters(expenseToRegister)

        return result
    }

    async getAllRefunds() {
        return await refundRepository.leerInfo()
    }
}

const refundService = new RefundService()

module.exports = refundService