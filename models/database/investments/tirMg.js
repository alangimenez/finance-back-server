const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const coleccion = 'tir';

const tirSchema = new Schema ({
    bondName: {type: String},
    datetime: {type: Date},
    tir: {type: Number}
})

const Tir = mongoose.model(coleccion, tirSchema);

module.exports = Tir;