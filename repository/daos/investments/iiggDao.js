const { CrudMongo } = require('../../crud/crud');
const iiggModel = require('../../../models/database/investments/iiggMg');
// const { ErrorHandler } = require('../../../error/error');
// const error = new ErrorHandler();

class iiggDao extends CrudMongo {
    constructor() {
        super(iiggModel)
    }
}

let iiggSingleton = new iiggDao()

module.exports = iiggSingleton