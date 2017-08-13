const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

module.exports = mongoose.model('Usuario', new Schema({
    nome: String,
    senha: String,
    admin: Boolean
}));