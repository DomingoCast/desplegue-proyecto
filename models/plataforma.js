/*
Archiu de model de pel·lícula amb subdocument de plataforma
*/
const mongoose = require("mongoose");

let plataformaSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    minlength: 2,
    trim: true,
  },
  data: {
    type: Date,
  },
  quantitat: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = plataformaSchema;
