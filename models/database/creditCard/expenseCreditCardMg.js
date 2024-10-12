const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const coleccion = 'expenseCreditCard';

const expenseExpenseCreditCardSchema = new Schema ({
    name: {type: String},
    debtAccount: {type: String},
    closeDate: {type: Date},
    paymentDate: {type: Date},
    month: {type: String},
    year: {type: Number},
    expenses: {type: Array},
    status: {type: String}
})

const ExpenseCreditCard = mongoose.model(coleccion, expenseExpenseCreditCardSchema);

module.exports = ExpenseCreditCard;