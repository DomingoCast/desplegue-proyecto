const express = require("express");
const multer = require("multer");

let Pelicula = require(__dirname + "/../models/pelicula.js");
let router = express.Router();

const generes = ["comedia", "terror", "drama", "aventures ", "altres"];

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
      res.render("public_index", {
        pelicules: resultado,
        generes: generes,
        query: req.query,
      });
    })
    .catch((error) => {});
});

// Formulario de nuevo pelicula
router.get("/buscar", (req, res) => {
  console.log(req.query);
  Pelicula.find({
    titol: { $regex: req.query.titol, $options: "i" },
    genere: { $regex: req.query.genere, $options: "i" },
  })
    .then((resultado) => {
      res.render("public_index", {
        pelicules: resultado,
        generes: generes,
        query: req.query,
      });
    })
    .catch((error) => {});
});

// Formulario de edición de pelicula
/*
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
*/

// Ficha de pelicula
router.get("/pelicula/:id", (req, res) => {
  Pelicula.findById(req.params.id)
    .populate("director")
    .then((resultado) => {
      console.log(resultado.plataformes);
      if (resultado) res.render("public_pelicula", { pelicula: resultado });
      else res.render("error", { error: "Pelicula no encontrada" });
    })
    .catch((err) => {
      res.render("public_error", { error: "Pelicula no encontrada" });
    });
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

//////////////////////////

module.exports = router;
