/*
Archiu de model de pel·lícula amb subdocument de plataforma
*/
const { text } = require("body-parser");
const mongoose = require("mongoose");
const plataformaSchema = require(__dirname + "/plataforma.js");

let peliculaSchema = new mongoose.Schema({
  titol: {
    type: String,
    required: true,
    minlength: 2,
    trim: true,
  },
  sinopsi: {
    type: String,
    minlength: 10,
    required: true,
  },
  duracio: {
    type: Number,
    required: true,
    min: 0,
  },
  valoracio: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  genere: {
    type: String,
    enum: ["comedia", "terror", "drama", "aventures ", "altres"],
    required: true,
  },
  imatge: {
    type: String,
    required: false,
  },
  director: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "directors",
    required: true,
  },
  plataformes: [plataformaSchema],
});

let Pelicula = mongoose.model("pelicules", peliculaSchema);

module.exports = Pelicula;
