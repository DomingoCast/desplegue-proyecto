/*
Archiu de model de director
*/

const mongoose = require("mongoose");

const usuariSchema = new mongoose.Schema({
  login: {
    type: String,
    required: true,
    minlength: 5,
    unique: true,
  },
  password: {
    type: String,
    min: 8,
    required: true,
  },
});

const Usuari = mongoose.model("usuaris", usuariSchema);

module.exports = Usuari;
