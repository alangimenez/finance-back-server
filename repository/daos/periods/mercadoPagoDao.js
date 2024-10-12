const { CrudMongo } = require('../../crud/crud');
const mercadoPagoModel = require('../../../models/database/periods/mercadoPagoMg');
// const { ErrorHandler } = require('../../../error/error');
// const error = new ErrorHandler();

class mercadoPagoDao extends CrudMongo {
    constructor() {
        super(mercadoPagoModel)
    }

    async getLastPeriod() {
        try {
            const result = await this.model.find().sort({ $natural: -1 }).limit(1)
            return result
        } catch (e) {
            console.log(e)
        }
    }

    async uploadNewExpense(month, year, discount) {
        try {
            const result = await this.model.updateOne({month: month, year: year}, {$push: {discounts: discount}})
            return result
        } catch (e) {
            console.log(e)
        }
    }

    async updateDiscountConsumed(month, year, discount) {
        try {
            console.log(`discount in dao ${discount}`)
            const result = await this.model.updateOne({month: month, year: year}, {$set: {discountConsumed: discount}})
            console.log(`result ${result}`)
            return result
        } catch (e) {
            console.log(e)
        }
    }
}

let mercadoPagoSingleton = new mercadoPagoDao()

module.exports = mercadoPagoSingleton