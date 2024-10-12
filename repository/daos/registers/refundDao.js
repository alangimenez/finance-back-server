const { CrudMongo } = require('../../crud/crud');
const refundModel = require('../../../models/database/registers/refundMg');
// const { ErrorHandler } = require('../../../error/error');
// const error = new ErrorHandler();

class refundDao extends CrudMongo {
    constructor() {
        super(refundModel)
    }

    async uploadRefundOfAnExpense (refund, id) {
        try {
            const result = await this.model.updateOne({_id: id}, {$push: {refund: refund}, $set: {status: "CLOSED"}})
            return result
        } catch (e) {
            console.log(e)
        }
    }

    async leerInfoPorId(id) {
        try {
            return await this.model.find({ _id: id }, { __v: 0 });
        } catch (e) {
            console.log('cant leer info por id')
            // return error.errorProcess("CRUD Error", `El Crud ha tenido un error -> ` + e.message);
        }
    }
}

let refundSingleton = new refundDao()

module.exports = refundSingleton