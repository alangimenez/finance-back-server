const { CrudMongo } = require('../../crud/crud');
const monthRegisterModel = require('../../../models/database/registers/monthRegisterMg');
// const { ErrorHandler } = require('../../../error/error');
// const error = new ErrorHandler();

class monthRegisterDao extends CrudMongo {
    constructor() {
        super(monthRegisterModel)
    }

    async getOpenMonthRegister() {
        try {
            const result = await this.model.find({status: "OPEN"}, { __v: 0 })
            return result[0];
        } catch (e) {
            console.log(e.message)
        }
    }

    async updateMonthRegisterAndCloseIt(year, month, values) {
        try {
            const result = await this.model.updateOne({year: year, month: month}, {$set: {status: "CLOSED", values: values}})
            return result
        } catch (e) {
            console.log(e.message)
        }
    }

    async getMonthRegisterByYearAndMonth(year, month) {
        try {
            const result = await this.model.find({year: year, month: month}, { __v: 0 })
            return result[0];
        } catch (e) {
            console.log(e.message)
        }
    }
}

let monthRegisterSingleton = new monthRegisterDao()

module.exports = monthRegisterSingleton