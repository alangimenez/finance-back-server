const { CrudMongo } = require('../../crud/crud');
const registerModel = require('../../../models/database/registers/registerMg');
// const { ErrorHandler } = require('../../../error/error');
// const error = new ErrorHandler();

class registerDao extends CrudMongo {
    constructor() {
        super(registerModel)
    }

    async getRegistersFilterByDate(date) {
        try {
            const result = await this.model.find({ date: { $gt: new Date(date) } }, { __v: 0 })
            return result;
        } catch (e) {
            console.log(e.message)
        } 
    }

    async getLastTenRegisters() {
        try {
            const result = await this.model.find().sort({ $natural: -1 })
            return result;
        } catch (e) {
            console.log(e.message)
        }
    }

    async changeRegisterStatus(id) {
        try {
            const result = await this.model.updateOne({ _id: id }, { $set: { load: true } })
            return result
        } catch (e) {
            console.log(e.message)
        }
    }

    async getRegistersByType(type) {
        try {
            const result = await this.model.find({ type: { $all: type } }).sort({ $natural: -1 })
            return result
        } catch (e) {
            console.log(e.message)
        }
    }

    async getRegistersForExcel() {
        try {
            const result = await this.model.find({ load: 'false' }).sort({ $natural: 1 })
            return result
        } catch (e) {
            console.log(e.message)
        }
    }
}

let registerSingleton = new registerDao()

module.exports = registerSingleton