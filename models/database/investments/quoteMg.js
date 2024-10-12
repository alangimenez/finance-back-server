const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const coleccion = 'quotes';

const quotesSchema = new Schema ({
    date: {type: Date},
    quotes: {type: Object}
})

const Quotes = mongoose.model(coleccion, quotesSchema);

module.exports = Quotes;