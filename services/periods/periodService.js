const { convertRequest } = require("../../utils/utils")
const mercadoPagoService = require('./mercadoPagoService')

class PeriodService {
    constructor(){}

    async closePeriod(request){
        const data = convertRequest(request)

        const result = await mercadoPagoService.createNewPeriod(data)

        return result
    }
}

const periodService = new PeriodService()

module.exports = periodService