/*
Archiu de model de director
*/

const mongoose = require("mongoose");

const directorSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  naiximent: {
    type: Number,
    min: 0,
    max: 2000,
    required: false,
  },
});

const Director = mongoose.model("directors", directorSchema);

module.exports = Director;
