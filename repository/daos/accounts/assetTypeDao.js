const { CrudMongo } = require('../../crud/crud');
const assetTypeModel = require('../../../models/database/accounts/assetTypeMg');
// const { ErrorHandler } = require('../../../error/error');
// const error = new ErrorHandler();

class assetTypeDao extends CrudMongo {
    constructor() {
        super(assetTypeModel)
    }

    async associateTicketWithAssetType (ticket, assetType) {
        try {
            const result = await this.model.updateOne({assetType: assetType}, {$push: {ticketAssociated: ticket}})
            return result
        } catch (e) {
            console.log(e)
        }
    }
}

let assetTypeSingleton = new assetTypeDao()

module.exports = assetTypeSingleton