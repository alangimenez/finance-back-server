const { CrudMongo } = require('../../crud/crud');
const cashflowModel = require('../../../models/database/investments/cashflowMg');
// const { ErrorHandler } = require('../../../error/error');
// const error = new ErrorHandler();

class cashflowDao extends CrudMongo {
    constructor() {
        super(cashflowModel)
    }
}

let cashFlowSingleton = new cashflowDao()

module.exports = cashFlowSingleton