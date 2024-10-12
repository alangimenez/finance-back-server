const expenseCreditCardRepository = require('../../repository/daos/creditCard/expenseCreditCardDao')
const { convertRequest, addSpecificDays, transformDate } = require('../../utils/utils')
const expensesService = require('../registers/registerService')

class ExpenseCreditCardService {
    constructor() {
        this.month = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    }

    async createNewPeriod(request) {
        const creditCardData = convertRequest(request)

        const newPeriod = {
            ...creditCardData,
            "expenses": [],
            "status": "OPEN"
        }

        const result = await expenseCreditCardRepository.subirInfo(newPeriod)
        return result
    }

    async closeCreditCardPeriod(request) {
        const creditCardData = convertRequest(request)

        await expenseCreditCardRepository.closePeriodByNameAndPeriod(creditCardData)

        return ({ "message": "ok" })
    }

    async saveExpenseInCreditCard(request) {
        const batchExpenses = convertRequest(request)
        let { name, year, month, numberOfPayments } = batchExpenses
        let monthFirst = month
        let yearFirst = year

        let benefitMP = 1
        if (batchExpenses.benefitMP) { benefitMP = 0.3 }

        let monthInArray = this.month.findIndex(m => m == monthFirst)
        let debtAccount = ""

        for (let i = 0; i < numberOfPayments; i++) {
            if (monthInArray + i == 12) {
                monthFirst = this.month[0]
                yearFirst = yearFirst + 1
                monthInArray = -i
            } else {
                monthFirst = this.month[monthInArray + i]
                yearFirst = yearFirst
            }
            const period = await expenseCreditCardRepository.getExpensesByPeriodAndStatus(name, yearFirst, monthFirst)
            if (period.length == 0) {
                await this.createNewPeriod({
                    "name": name,
                    "debtAccount": debtAccount,
                    "month": monthFirst,
                    "year": yearFirst
                })
            } else {
                debtAccount = period[0].debtAccount
            }
        }

        monthInArray = this.month.findIndex(m => m == month)
        let yearSecond = year
        let monthSecond = month

        for (let i = 0; i < batchExpenses.numberOfPayments; i++) {
            batchExpenses.expenses.map(async expense => {
                if (monthInArray + i == 12) {
                    monthSecond = this.month[0]
                    yearSecond = yearSecond + 1
                    monthInArray = -i
                } else {
                    monthSecond = this.month[monthInArray + i]
                    yearSecond = yearSecond
                }
                const eachExpense = {
                    "date": new Date(batchExpenses.date),
                    "account": expense.debtAccount,
                    "amount": ((expense.debtAmount - expense.discountAmount) * benefitMP) / batchExpenses.numberOfPayments,
                    "comments": batchExpenses.comments
                }
                await expenseCreditCardRepository.addExpenseToCreditCardByPeriod(eachExpense, name, yearSecond, monthSecond)
            })
        }

        return ({ "message": "ok" })
    }

    async getPeriodByStatus(status) {
        let period = ""
        if (status == "ALL") {
            period = await expenseCreditCardRepository.leerInfo()
        } else {
            period = await expenseCreditCardRepository.getPeriodByStatus(status)
        }

        const creditCardNames = []

        period.map(it => {
            if (!creditCardNames.includes(it.name)) {
                creditCardNames.push(it.name)
            }
        })

        const creditCardWithPeriods = []
        creditCardNames.map(ccn => {
            creditCardWithPeriods.push({
                "name": ccn,
                "openPeriods": []
            })
        })

        period.map(op => {
            creditCardWithPeriods.map(ccwp => {
                if (op.name == ccwp.name && ccwp.openPeriods.findIndex(a => a.year == op.year) < 0) {
                    ccwp.openPeriods.push({
                        "year": op.year,
                        "month": [op.month]
                    })
                } else if (op.name == ccwp.name) {
                    const key = ccwp.openPeriods.findIndex(opccwp => opccwp.year == op.year)
                    ccwp.openPeriods[key].month.push(op.month)
                }
            })
        })

        creditCardWithPeriods.map(ccwp => {
            const key = period.findIndex(op => op.name == ccwp.name)
            ccwp['credit'] = period[key].debtAccount
        })

        return creditCardWithPeriods
    }

    async changeStatusOfPeriod(request) {
        const creditCardData = convertRequest(request)

        const result = await expenseCreditCardRepository.changeStatusOfPeriod(creditCardData)

        if (creditCardData.status == "PAID") {
            const creditCardPeriod = await expenseCreditCardRepository.getExpensesByPeriodAndStatus(creditCardData.name, creditCardData.year, creditCardData.month)

            const arrayOfExpenses = []
            creditCardPeriod[0].expenses.map(e => {
                const eachExpense = {
                    "debtAccount": e.account,
                    "debtAmount": e.amount,
                    "discountAmount": 0
                }
                arrayOfExpenses.push(eachExpense)
            })

            const batchOfExpenses = {
                "date": creditCardPeriod[0].paymentDate,
                "currency": "ARS",
                "credit": creditCardPeriod[0].debtAccount,
                "comments": `${creditCardPeriod[0].name} - ${creditCardPeriod[0].year} - ${creditCardPeriod[0].month}`,
                "expenses": arrayOfExpenses,
                "load": false
            }

            expensesService.saveBatchRegisters(batchOfExpenses)
        }

        return result
    }

    async getExpensesByCreditCardAndPeriod(request) {
        const { name, year, month } = request
        let expenses = await expenseCreditCardRepository.getExpensesByPeriodAndStatus(name, year, month)

        const response = []
        expenses.map(e => {

            const arrayOfEachExpense = []
            e.expenses.map(eachExpense => {
                const newExpense = {
                    ...eachExpense,
                    date: transformDate(eachExpense.date)
                }
                arrayOfEachExpense.push(newExpense)
            })

            const expense = {
                ...e._doc,
                "period": this.convertNumberPeriodToStringPeriod(e.period),
                expenses: arrayOfEachExpense
            }
            response.push(expense)
        })

        return response
    }

    async getExpensesByCreditCard() {
        const expenses = await expenseCreditCardRepository.leerInfo()

        const response = []
        expenses.map(e => {

            const arrayOfEachExpense = []
            e.expenses.map(eachExpense => {
                const newExpense = {
                    ...eachExpense,
                    date: transformDate(eachExpense.date)
                }
                arrayOfEachExpense.push(newExpense)
            })

            const expense = {
                ...e._doc,
                "period": this.convertNumberPeriodToStringPeriod(e.period),
                "closeDate": transformDate(e.closeDate),
                "paymentDate": transformDate(e.paymentDate),
                expenses: arrayOfEachExpense
            }
            response.push(expense)
        })

        return response
    }

    // PRIVATE

    convertStringPeriodToNumberPeriod(string) {
        let period = this.month.findIndex(it => it == string)
        return period + 1
    }

    convertNumberPeriodToStringPeriod(number) {
        return this.month[number - 1]
    }
}

const expenseCreditCardService = new ExpenseCreditCardService()

module.exports = expenseCreditCardService