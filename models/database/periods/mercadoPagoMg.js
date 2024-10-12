const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const coleccion = 'mercadopagos';

const mercadoPagoSchema = new Schema ({
    month: {type: String},
    year: {type: Number},
    discountTotal: {type: Number},
    discountConsumed: {type: Number},
    discounts: {type: Array}
})

const MercadoPago = mongoose.model(coleccion, mercadoPagoSchema);

module.exports = MercadoPago;