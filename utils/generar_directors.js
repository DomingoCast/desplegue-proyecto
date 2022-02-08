const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/pelicules2", {
  useNewUrlParser: true,
});

const Director = require(__dirname + "/../models/director");
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
