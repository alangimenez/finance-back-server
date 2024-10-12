const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const coleccion = 'investments';

const investmentSchema = new Schema ({
    ticket: {type: String},
    operationDate: {type: String},
    operationQuantity: {type: Number},
    operationPrice: {type: Number},
    operationCurrency: {type: String},
    assetType: {type: String},
    operation: {type: String},
    actualQuantity: {type: Number},
    commission: {type: Number},
    commissionCurrency: {type: String}
})

const Investment = mongoose.model(coleccion, investmentSchema);

module.exports = Investment;