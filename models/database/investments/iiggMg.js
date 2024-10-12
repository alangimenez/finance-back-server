const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const coleccion = 'iigg';

const iiggSchema = new Schema ({
    dateOfOperation: {type: String},
    bondName: {type: String},
    ticket: {type: String},
    quantity: {type: mongoose.Types.Decimal128},
    exchangeRate: {type: mongoose.Types.Decimal128},
    price: {type: mongoose.Types.Decimal128},
    amount: {type: mongoose.Types.Decimal128},
    commission: {type: mongoose.Types.Decimal128},
    assetType: {type: String},
    gains: {type: mongoose.Types.Decimal128},
    operation: {type: String},
    currency: {type: String},
})

const Iigg = mongoose.model(coleccion, iiggSchema);

module.exports = Iigg;