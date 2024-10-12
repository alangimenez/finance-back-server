const { CrudMongo } = require('../../crud/crud');
const quoteModel = require('../../../models/database/investments/quoteMg');
// const { ErrorHandler } = require('../../../error/error');
// const error = new ErrorHandler();

class quotesDao extends CrudMongo {
    constructor() {
        super(quoteModel)
    }
}

let quotesSingleton = new quotesDao()

module.exports = quotesSingleton