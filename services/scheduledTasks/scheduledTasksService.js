const lastValueService = require('../../services/investments/lastValueService')
const userService = require('../../services/user/userService')

class ScheduledTasksService {
    constructor() { }

    async runScheduledTask(event) {
        if (event.id === "test") {
            await lastValueService.saveQuotesAndOtherQuotes()
        }
        if (event.id === "close-month") {
            await userService.resetCounterOfIolClient()
        }
        return
    }
}

const scheduledTasksService = new ScheduledTasksService()

module.exports = scheduledTasksService