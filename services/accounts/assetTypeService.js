const assetTypeRepository = require('../../repository/daos/accounts/assetTypeDao')
const { convertRequest } = require('../../utils/utils')

class AssetType {
    constructor(){}

    async getAllAssetType() {
        const assetTypes = await assetTypeRepository.leerInfo()
        const response = []
        assetTypes.map(at => response.push({
            "assetType": at.assetType,
            "assets": at.ticketAssociated
        }))
        return response
    }

    async createAssetType(request) {
        let assetType = convertRequest(request);

        return await assetTypeRepository.subirInfo(assetType)
    }

    async associateTicketWithAssetType(request) {
        let association = convertRequest(request);

        const result = await assetTypeRepository.associateTicketWithAssetType(association.ticket, association.assetType)
        return result
    }
}

const assetTypeService = new AssetType()

module.exports = assetTypeService