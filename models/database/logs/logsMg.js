const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const coleccion = 'logs';

const logSchema = new Schema ({
    date: {type: Date},
    message: {type: Object},
    stacktrace: {type: String}
})

const Logs = mongoose.model(coleccion, logSchema);

module.exports = Logs;