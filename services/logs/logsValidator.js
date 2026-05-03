class LogsValidator {
    validateGetLogs({ startDate, endDate, labels }) {
        const errors = []

        if (startDate || endDate) {
            if (!startDate) {
                errors.push('Debe especificar la fecha de inicio')
            }
            if (!endDate) {
                errors.push('Debe especificar la fecha de fin')
            }
            if (startDate && endDate) {
                const start = new Date(startDate)
                const end = new Date(endDate)
                
                if (isNaN(start.getTime())) {
                    errors.push('La fecha de inicio no es válida')
                }
                if (isNaN(end.getTime())) {
                    errors.push('La fecha de fin no es válida')
                }
                if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                    const diffTime = Math.abs(end - start)
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                    
                    if (diffDays > 7) {
                        errors.push('El período seleccionado no puede superar los 7 días')
                    }
                }
            }
        }

        if (labels && labels.length > 0) {
            const validLabels = ['error', 'warn', 'info', 'debug']
            const invalidLabels = labels.filter(l => !validLabels.includes(l))
            
            if (invalidLabels.length > 0) {
                errors.push(`Los siguientes labels no son válidos: ${invalidLabels.join(', ')}. Los labels válidos son: ${validLabels.join(', ')}`)
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        }
    }
}

const logsValidator = new LogsValidator()

module.exports = logsValidator