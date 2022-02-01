const mongoose = require("mongoose");
const Usuari = require(__dirname + "/../models/usuari");
mongoose.connect("mongodb://localhost:27017/FilmEsV3");
Usuari.collection.drop();
let usu1 = new Usuari({
  login: "may",
  password: "1234",
});
usu1.save();
let usu2 = new Usuari({
  login: "laura",
  password: "5678",
});
usu2.save();
