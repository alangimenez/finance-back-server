const { CrudMongo } = require('../../crud/crud');
const expenseCreditCardModel = require('../../../models/database/creditCard/expenseCreditCardMg');
const creditCardSingleton = require('./creditCardDao');
// const { ErrorHandler } = require('../../../error/error');
// const error = new ErrorHandler();

class expenseCreditCardDao extends CrudMongo {
    constructor() {
        super(expenseCreditCardModel)
    }

    async getLastPeriodByCreditCardName(name) {
        try {
            const result = await this.model.find({ name: name }, { __v: 0 }).sort({ $natural: -1 }).limit(1)
            return result
        } catch (e) {
            console.log(e)
        }
    }

    async closePeriodByNameAndPeriod(creditCard) {
        try {
            const result = await this.model.updateOne({ name: creditCard.name, period: creditCard.period }, { $set: { status: "CLOSE" } })
            return result
        } catch (e) {
            console.log(e)
        }
    }

    async getPeriodByStatus(status) {
        try {
            const result = await this.model.find({ status: status }, { __v: 0 })
            return result
        } catch (e) {
            console.log(e)
        }
    }

    async addExpenseToCreditCardByPeriod(expense, name, year, month) {
        try {
            const result = await this.model.updateOne({
                name: name,
                year: Number(year),
                month: month
            }, { $push: { expenses: expense } })
            return result
        } catch (e) {
            console.log(e)
        }
    }

    async changeStatusOfPeriod(creditCard) {
        try {
            const result = await this.model.updateOne({
                name: creditCard.name,
                year: creditCard.year,
                month: creditCard.month
            }, { $set: { status: creditCard.status } })
            return result
        } catch (e) {
            console.log(e)
        }
    }

    async getPeriodByCreditCard(name, period) {
        try {
            const result = await this.model.find({ name: name, period: period }, { __v: 0 })
            return result[0]
        } catch (e) {
            console.log(e)
        }
    }

    async getExpensesByPeriodAndStatus(name, year, month) {
        try {
            const result = await this.model.find({ name: name, year: Number(year), month: month }, { __v: 0 })
            return result
        } catch (e) {
            console.log(e)
        }
    }
}

let expenseCreditCardSingleton = new expenseCreditCardDao()

module.exports = expenseCreditCardSingleton