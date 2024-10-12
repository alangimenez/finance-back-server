const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const coleccion = 'refunds';

const refundSchema = new Schema ({
    date: {type: Date},
    expenses: {type: Array},
    refund: {type: Array},
    total: {type: Number},
    status: {type: String}
})

const Refund = mongoose.model(coleccion, refundSchema);

module.exports = Refund;