const logRepository = require('../../repository/daos/logs/logsDao')
const config = require('../../config/config.environments')

class LogService {
    constructor(){}

    async createNewMessage(message) {
        if (config.NODE_ENV === 'dev') console.log(message);
        await logRepository.subirInfo({
            date: new Date(),
            message: message
        })
    }
}

const logService = new LogService()

module.exports = logService