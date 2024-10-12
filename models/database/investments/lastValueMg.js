const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const coleccion = 'lastvalues';

const lastValueSchema = new Schema ({
    date: {type: Date},
    quotes: {type: Object},
    otherQuotes: {type: Object}
})

const LastValue = mongoose.model(coleccion, lastValueSchema);

module.exports = LastValue;