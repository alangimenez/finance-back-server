const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const coleccion = 'assettype';

const assetTypeSchema = new Schema ({
    assetType: {type: String},
    ticketAssociated: {type: Array}
})

const AssetType = mongoose.model(coleccion, assetTypeSchema);

module.exports = AssetType;