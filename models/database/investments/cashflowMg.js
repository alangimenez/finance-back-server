const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const coleccion = 'cashflow';

const cashflowSchema = new Schema ({
    ticket: {type: String},
    company: {type: String},
    start: {type: Date},
    finish: {type: Date},
    rate: {type: Number},
    dateOfPayment: {type: Array},
    amountInterest: {type: Array},
    amountAmortization: {type: Array}
})

const Cashflow = mongoose.model(coleccion, cashflowSchema);

module.exports = Cashflow;