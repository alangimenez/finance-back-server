const investmentRepository = require('../../repository/daos/investments/investmentDao')

class IiggService {
    constructor () {}

    async saveInvestment(response) {
        let investment;
        if (typeof(response) == 'string') {
            investment = JSON.parse(response)
        } else {
            investment = response
        }

        await investmentRepository.subirInfo(investment)
    }

    async getInvestments() {
        const investments =  await investmentRepository.leerInfo()
        const investmentsResponse = []

        investments.map((e) => {
            investmentsResponse.push({
                ...e._doc,
                quantity: e.quantity.toString(),
                purchasePrice: e.purchasePrice.toString()
            })
        })
        return investmentsResponse
    }
}

const iiggService = new IiggService()

module.exports = iiggService