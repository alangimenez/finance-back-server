const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const coleccion = 'otherquotes';

const otherQuotesScheme = new Schema ({
    date: {type: Date},
    quotes: {type: Object}
})

const OtherQuotes = mongoose.model(coleccion, otherQuotesScheme);

module.exports = OtherQuotes;