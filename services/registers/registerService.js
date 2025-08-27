const registerRepository = require('../../repository/daos/registers/registerDao');
const accountService = require('../accounts/accountService');
const { transformDate, convertRequest, parseDate } = require('../../utils/utils')
const { formatDateOfMongo } = require('../../formatter/accounts/accountFormatter');

class RegistersService {
    constructor() { }

    async saveRegister(request) {
        let register = convertRequest(request)

        register.date = new Date(register.date)
        register.load = false

        await registerRepository.subirInfo(register)
        await accountService.updateBalance(register.debitAmount, register.debit, "add")
        await accountService.updateBalance(register.creditAmount, register.credit, "subtract")
        return ({ 'message': 'ok' })
    }

    async getRegisterFilterByDate(date) {
        const result = await registerRepository.getRegistersFilterByDate(date);
        return result;
    }

    async getLastTenRegisters() {
        const Registers = await registerRepository.getLastTenRegisters();
        const result = []
        Registers.map((register) => {
            result.push({
                ...register._doc,
                date: transformDate(register.date)
            }
            )
        })
        return result;
    }

    async changeRegisterStatus(id) {
        const result = await registerRepository.changeRegisterStatus(id)
        return result
    }

    async saveBatchRegisters(request) {
        let batchRegisters = convertRequest(request)
        let debitCurrency = batchRegisters.currency
        let creditCurrency = batchRegisters.currency

        // mercado pago flag
        let benefitMP = 1
        if (batchRegisters.benefitMP) { benefitMP = 0.3 }

        // investment flag
        if (batchRegisters.investment) {
            if (batchRegisters.operation === "Buy") {
                const account = await accountService.getNameByTicket(batchRegisters.expenses[0].debtAccount)
                batchRegisters.expenses[0].debtAccount = account
            } else {
                const account = await accountService.getNameByTicket(batchRegisters.credit)
                batchRegisters.credit = account
            }
        }

        let amount = 0
        batchRegisters.expenses.map((register) => {
            let debitAmount = Number(((+register.debtAmount - +register.discountAmount) * benefitMP).toFixed(2))
            let creditAmount = Number(((+register.debtAmount - +register.discountAmount) * benefitMP).toFixed(2))

            // investment ars to usd flag
            if (batchRegisters.arsToUsd) {
                debitCurrency = 'USD'
                creditAmount = batchRegisters.creditAmount
                creditCurrency = batchRegisters.creditCurrency
            }

            const eachRegister = {
                "date": batchRegisters.date,
                "debit": register.debtAccount,
                "debitCurrency": debitCurrency,
                "debitAmount": debitAmount,
                "credit": batchRegisters.credit,
                "creditCurrency": creditCurrency,
                "creditAmount": creditAmount,
                "comments": batchRegisters.comments,
                "type": batchRegisters.type,
                "load": batchRegisters.load
            }
            registerRepository.subirInfo(eachRegister)
            accountService.updateBalance(register.debtAmount - register.discountAmount, register.debtAccount, debitCurrency, "add")
            amount = +amount + +eachRegister.creditAmount
        })

        await accountService.updateBalance(amount, batchRegisters.credit, creditCurrency, "subtract")

        return ({ "message": "ok" })
    }

    async saveBatchExcelRegisters(request) {
        let successfulRegisters = 0
        let errors = []
        await Promise.all(request.map(async register => {
            try {
                register.date = parseDate(register.date)
                register.load = false
                register.debitAmount = Number(String(register.debitAmount).replace(",", "."))
                register.creditAmount = Number(String(register.creditAmount).replace(",", "."))
                let response = await registerRepository.subirInfo(register)
                if (response._id) successfulRegisters++
            } catch (error) {
                errors.push({ "register": register, "error": error.message })
            }
        }))

        return {
            "registersToSave": request.length,
            "successfulRegisters": successfulRegisters,
            "errors": errors
        }
    }

    async saveEarning(request) {
        const earning = convertRequest(request)
        earning.load = false

        const result = await registerRepository.subirInfo(earning)

        await accountService.updateBalance(+earning.debitAmount, earning.debit, earning.debitCurrency, "add")
        await accountService.updateBalance(+earning.creditAmount, earning.credit, earning.creditCurrency, "add")
        return result
    }

    async getRegistersByType(request) {
        const types = request.type.split(',')

        let registers = await registerRepository.getRegistersByType(types)
        let response = []
        registers.forEach(it => {
            let object = {
                date: formatDateOfMongo(it.date),
                debit: it.debit,
                debitCurrency: it.debitCurrency,
                credit: it.credit,
                creditCurrency: it.creditCurrency,
                debitAmount: it.debitAmount,
                creditAmount: it.creditAmount,
                comments: it.comments,
                type: it.type,
                load: it.load
            }
            response.push(object)
        })
        return response
    }

    async getRegisterForExcel() {
        const registers = await registerRepository.getRegistersForExcel()
        const response = []
        registers.forEach(it => {
            let object = {
                _id: it._id,
                date: formatDateOfMongo(it.date),
                debit: it.debit,
                debitCurrency: it.debitCurrency,
                credit: it.credit,
                creditCurrency: it.creditCurrency,
                debitAmount: String(it.debitAmount).replace(".", ","),
                creditAmount: String(it.creditAmount).replace(".", ","),
                comments: it.comments,
                type: it.type
            }
            response.push(object)
        })
        return response
    }
}

const registersService = new RegistersService()

module.exports = registersService