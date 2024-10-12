const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const coleccion = 'tir';

const tirSchema = new Schema ({
    bondName: {type: String},
    date: {type: String},
    time: {type: String},
    tir: {type: mongoose.Types.Decimal128}
})

const Tir = mongoose.model(coleccion, tirSchema);

module.exports = Tir;