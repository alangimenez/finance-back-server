const { CrudMongo } = require('../../crud/crud');
const logModel = require('../../../models/database/logs/logsMg');

class logsDao extends CrudMongo {
    constructor() {
        super(logModel)
    }
}

let logSingleton = new logsDao()

module.exports = logSingleton