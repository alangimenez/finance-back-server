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
            const start = new Date(startDate)
            const end = new Date(endDate)
            
            const diffTime = Math.abs(end - start)
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            
            if (diffDays > 7) {
                throw new Error('El período seleccionado no puede superar los 7 días')
            }
            
            query.date = { $gte: start, $lte: end }
        } else if (startDate || endDate) {
            throw new Error('Debe especificar tanto la fecha de inicio como la fecha de fin')
        }

        if (labels && labels.length > 0) {
            const validLabels = ['error', 'warn', 'info', 'debug']
            const invalidLabels = labels.filter(l => !validLabels.includes(l))
            
            if (invalidLabels.length > 0) {
                throw new Error(`Los siguientes labels no son válidos: ${invalidLabels.join(', ')}. Los labels válidos son: ${validLabels.join(', ')}`)
            }
            
            query.label = { $in: labels }
        }

        return await logRepository.filtrarLogs(query)
    }
}

const logService = new LogService()

module.exports = logService