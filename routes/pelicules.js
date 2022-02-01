const express = require("express");
const multer = require("multer");
const Director = require("../models/director");

const generes = ["comedia", "terror", "drama", "aventures ", "altres"];

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
router.get("/nuevo", (req, res) => {
  Director.find()
    .then((resultado) => {
      res.render("admin_pelicules_form", {
        directors: resultado,
        generes: generes,
        new: true,
      });
    })
    .catch((err) => {
      console.err(err);
    });
});

// Formulario de edición de pelicula
router.get("/editar/:id", (req, res) => {
  Pelicula.findById(req.params["id"])
    .then((pelicula) => {
      if (pelicula) {
        Director.find().then((directors) => {
          res.render("admin_pelicules_form", {
            pelicula: pelicula,
            generes: generes,
            directors: directors,
            new: false,
          });
        });
      } else {
        res.render("admin_error", { error: "Pelicula no encontrado" });
      }
    })
    .catch((error) => {
      res.render("admin_error", { error: "Pelicula no encontrado" });
    });
});

// Ficha de pelicula
router.get("/:id", (req, res) => {
  Pelicula.findById(req.params.id)
    .populate("director")
    .populate("director")
    .then((resultado) => {
      console.log(resultado.plataformes);
      if (resultado) res.render("public_pelicula", { pelicula: resultado });
      else res.render("error", { error: "Pelicula no encontrado" });
    })
    .catch((error) => {});
});

// Insertar pelicules
router.post("/", upload.single("imatge"), (req, res) => {
  let nuevoPelicula = new Pelicula({
    titol: req.body.titol,
    sinopsi: req.body.sinopsi,
    duracio: req.body.duracio,
    valoracio: req.body.valoracio,
    genere: req.body.genere,
    imatge: req.file.filename,
    director: req.body.director,
    plataformes: [
      req.body.plat_nom
        ? {
            nom: req.body.plat_nom,
            data: req.body.plat_data,
            quantitat: req.body.plat_quantitat,
          }
        : null,
    ],
  });
  nuevoPelicula
    .save()
    .then((resultado) => {
      res.redirect(req.baseUrl);
    })
    .catch((error) => {
      console.error(error);
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
router.put("/:id" /*, upload.single("imatge")*/, (req, res) => {
  Pelicula.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        titol: req.body.titol,
        sinopsi: req.body.sinopsi,
        duracio: req.body.duracio,
        valoracio: req.body.valoracio,
        genere: req.body.genere,
        // imatge: req.file.filename,
        director: req.body.director,
      },
      $push: req.body.plat_nom
        ? {
            plataformes: {
              nom: req.body.plat_nom,
              data: req.body.plat_data,
              quantitat: req.body.plat_quantitat,
            },
          }
        : {},
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
