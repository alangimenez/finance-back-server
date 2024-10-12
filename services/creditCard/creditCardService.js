const creditCardRepository = require('../../repository/daos/creditCard/creditCardDao')

class CreditCardService {
    constructor(){}

    async getAllCreditCards() {
        const result = await creditCardRepository.leerInfo()
        return result
    }

    async createNewCreditCard(request) {
        let creditCard;
        if (typeof(request) == 'string') {
            creditCard = JSON.parse(request)
        } else {
            creditCard = request
        }

        const result = await creditCardRepository.subirInfo(creditCard)
        return result
    }
}

const creditCardService = new CreditCardService()

module.exports = creditCardService