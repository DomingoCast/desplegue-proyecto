const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/pelicules2", {
  useNewUrlParser: true,
});

const Usuari = require(__dirname + "/../models/usuari");

Usuari.collection.drop();

let usu1 = new Usuari({
  login: "admin",
  password: "12345678",
});
usu1.save();
let usu2 = new Usuari({
  login: "usuari",
  password: "12345678",
});
usu2.save();
