const logRepository = require('../../repository/daos/logs/logsDao')

class LogService {
    constructor(){}

    async createNewMessage(message) {
        await logRepository.subirInfo({
            date: new Date(),
            message: message
        })
    }
}

const logService = new LogService()

module.exports = logService