const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const coleccion = 'registers';

const registerSchema = new Schema ({
    date: {type: Date},
    debit: {type: String},
    debitCurrency: {type: String},
    credit: {type: String},
    creditCurrency: {type: String},
    debitAmount: {type: Number},
    creditAmount: {type: Number},
    comments: {type: String},
    load: {type: Boolean}, 
    type: {type: Array}
})

const Register = mongoose.model(coleccion, registerSchema);

module.exports = Register;