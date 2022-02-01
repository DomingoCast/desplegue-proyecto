const express = require("express");
const multer = require("multer");

let Pelicula = require(__dirname + "/../models/pelicula.js");
let router = express.Router();

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

let upload = multer({ storage: storage });

// Listado general
router.get("/", (req, res) => {
  Pelicula.find()
    .then((resultado) => {
      res.render("public_index", { pelicules: resultado });
    })
    .catch((error) => {});
});

// Formulario de nuevo pelicula
router.get("/buscar", (req, res) => {
  Pelicula.find({ name: req.body.name })
    .then((resultado) => {
      res.render("public_index", { pelicules: resultado });
    })
    .catch((error) => {});
});

// Formulario de edición de pelicula
router.get("/editar/:id", (req, res) => {
  Pelicula.findById(req.params["id"])
    .then((resultado) => {
      if (resultado) {
        res.render("pelicules_editar", { pelicula: resultado });
      } else {
        res.render("error", { error: "Pelicula no encontrado" });
      }
    })
    .catch((error) => {
      res.render("error", { error: "Pelicula no encontrado" });
    });
});

// Ficha de pelicula
router.get("/:id", (req, res) => {
  Pelicula.findById(req.params.id)
    .then((resultado) => {
      if (resultado) res.render("pelicules_ficha", { pelicula: resultado });
      else res.render("error", { error: "Pelicula no encontrado" });
    })
    .catch((error) => {});
});

// Insertar pelicules
router.post("/", upload.single("portada"), (req, res) => {
  let nuevoPelicula = new Pelicula({
    titulo: req.body.titulo,
    editorial: req.body.editorial,
    precio: req.body.precio,
    portada: req.file.filename,
  });
  nuevoPelicula
    .save()
    .then((resultado) => {
      res.redirect(req.baseUrl);
    })
    .catch((error) => {
      res.render("error", { error: "Error insertando pelicula" });
    });
});

// Borrar pelicules
router.delete("/:id", (req, res) => {
  Pelicula.findByIdAndRemove(req.params.id)
    .then((resultado) => {
      res.redirect(req.baseUrl);
    })
    .catch((error) => {
      res.render("error", { error: "Error borrando pelicula" });
    });
});

// Modificar pelicules
router.put("/:id", (req, res) => {
  Pelicula.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        titulo: req.body.titulo,
        editorial: req.body.editorial,
        precio: req.body.precio,
      },
    },
    { new: true }
  )
    .then((resultado) => {
      res.redirect(req.baseUrl);
    })
    .catch((error) => {
      res.render("error", { error: "Error modificando pelicula" });
    });
});

module.exports = router;
