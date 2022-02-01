const mongoose = require("mongoose");
const Director = require(__dirname + "/../models/director");
mongoose.connect("mongodb://localhost:27017/pelicules2");
Director.collection.drop();
let d1 = new Director({
  nom: "nom1",
  naiximent: 1111,
});
d1.save()
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
let d2 = new Director({
  nom: "nom2",
  naiximent: 1112,
});
d2.save();
