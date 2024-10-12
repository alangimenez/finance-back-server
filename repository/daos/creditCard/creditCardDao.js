const { CrudMongo } = require('../../crud/crud');
const creditCardModel = require('../../../models/database/creditCard/creditCardMg');
// const { ErrorHandler } = require('../../../error/error');
// const error = new ErrorHandler();

class creditCardDao extends CrudMongo {
    constructor() {
        super(creditCardModel)
    }
}

let creditCardSingleton = new creditCardDao()

module.exports = creditCardSingleton