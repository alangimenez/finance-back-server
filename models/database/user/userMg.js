const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const coleccion = 'users';

const userSchema = new Schema ({
    user: {type: String},
    email: {type: String},
    password: {type: String},
    access_token: {type: String}, 
    refresh_token: {type: String},
    accessTokenExpires: {type: Date},
    refreshTokenExpires: {type: Date},
    counter: {type: Number},
    historical: {type: Array}
})

const User = mongoose.model(coleccion, userSchema);

module.exports = User;