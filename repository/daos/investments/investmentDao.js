const { CrudMongo } = require('../../crud/crud');
const investmentModel = require('../../../models/database/investments/investmentMg');
// const { ErrorHandler } = require('../../../error/error');
// const error = new ErrorHandler();

class investmentDao extends CrudMongo {
    constructor() {
        super(investmentModel)
    }

    async getOperationsByTicket(ticket) {
        try {
            return await this.model.find({ ticket: ticket, actualQuantity: { $gt: 0} }, { __v: 0 });
        } catch (e) {
            logger.error("can't read info by ticket")
            // return error.errorProcess("CRUD Error", `El Crud ha tenido un error -> ` + e.message);
        }
    }

    async updateInvestmentRegister(id, quantity) {
        try {
            return await this.model.updateOne({_id: id}, { actualQuantity: quantity });
        } catch (e) {
            logger.error("can't read update investment register")
            // return error.errorProcess("CRUD Error", `El Crud ha tenido un error -> ` + e.message);
        }
    }

    async getRemainingOperations() {
        try {
            return await this.model.find({ actualQuantity: { $gt: 0}, operation: "Buy" }, { __v: 0 });
        } catch (e) {
            logger.error("can't read info by ticket")
            // return error.errorProcess("CRUD Error", `El Crud ha tenido un error -> ` + e.message);
        }
    }
}

let investmentSingleton = new investmentDao()

module.exports = investmentSingleton