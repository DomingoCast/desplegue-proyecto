const mongoose = require("mongoose");
let urimongo = "mongodb+srv://admin:admin@cluster0.0aa3g.mongodb.net/test";
console.log(typeof urimongo);
mongoose
  .connect(urimongo, { useNewUrlParser: true, serverSelectionTimeoutMS: 5000 })
  .catch((err) => console.error(err));
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
