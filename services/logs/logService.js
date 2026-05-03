const logRepository = require('../../repository/daos/logs/logsDao')
const config = require('../../config/config.environments')

class LogService {
    constructor(){}

    async createNewMessage(message, label = 'debug') {
        if (config.NODE_ENV === 'dev') console.log(message);
        await logRepository.subirInfo({
            date: new Date(),
            message: message,
            label: label
        })
    }

    async getLogs({ startDate, endDate, labels }) {
        const query = {}

        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) }
        }

        if (labels && labels.length > 0) {
            query.label = { $in: labels }
        }

        return await logRepository.filtrarLogs(query)
    }
}

const logService = new LogService()

module.exports = logService