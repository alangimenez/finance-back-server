const { CrudMongo } = require('../../crud/crud');
const logModel = require('../../../models/database/logs/logsMg');
const logService = require('../../../services/logs/logService');

class logsDao extends CrudMongo {
    constructor() {
        super(logModel)
    }

    async filtrarLogs(query) {
        try {
            return await this.model.find(query).sort({ date: -1 })
        } catch (e) {
            logService.createNewMessage(`Error al filtrar logs: ${e.message}`, 'error')
            throw new Error(`Error al filtrar logs: ${e.message}`)
        }
    }
}

let logSingleton = new logsDao()

module.exports = logSingleton