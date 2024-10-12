const { CrudMongo } = require('../../crud/crud');
const otherQuotesModel = require('../../../models/database/investments/otherQuotesMg');
// const { ErrorHandler } = require('../../../error/error');
// const error = new ErrorHandler();

class otherQuotesDao extends CrudMongo {
    constructor() {
        super(otherQuotesModel)
    }

    async getLastQuote() {
        try {
            const result = await this.model.find().sort({date:-1}).limit(1)
            return result;
        } catch (e) {
            console.log(e.message)
        }
    }
    
}

let otherQuotesSingleton = new otherQuotesDao()

module.exports = otherQuotesSingleton