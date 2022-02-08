const express = require("express");
const multer = require("multer");
const Director = require("../models/director");
const autenticacio = require("../utils/autenticacio");
// let autenticacio = (req, res, next) => {
//   if (req.session && req.session.usuario) return next();
//   else res.render("auth_login");
// };

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
router.get("/", autenticacio, (req, res) => {
  Pelicula.find()
    .then((resultado) => {
      res.render("admin_pelicules", { pelicules: resultado });
    })
    // .catch((error) => {});
    .catch((error) => res.render("admin_error"));
});

// Formulario de nuevo pelicula
router.get("/nova", autenticacio, (req, res) => {
  Director.find()
    .then((resultado) => {
      res.render("admin_pelicules_form", {
        directors: resultado,
        generes: generes,
        new: true,
      });
    })
    // .catch((err) => {});
    .catch((error) => res.render("admin_error"));
});

// Formulario de edición de pelicula
router.get("/editar/:id", autenticacio, (req, res) => {
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

// Insertar pelicules
router.post("/", autenticacio, upload.single("imatge"), (req, res) => {
  let nuevoPelicula = new Pelicula(
    req.body.platnom
      ? {
          titol: req.body.titol,
          sinopsi: req.body.sinopsi,
          duracio: req.body.duracio,
          valoracio: req.body.valoracio,
          genere: req.body.genere,
          imatge: req.file.filename,
          director: req.body.director,
          plataformes: [
            {
              nom: req.body.plat_nom,
              data: req.body.plat_data,
              quantitat: req.body.plat_quantitat,
            },
          ],
        }
      : {
          titol: req.body.titol,
          sinopsi: req.body.sinopsi,
          duracio: req.body.duracio,
          valoracio: req.body.valoracio,
          genere: req.body.genere,
          imatge: req.file.filename,
          director: req.body.director,
          plataformes: [],
        }
  );
  nuevoPelicula
    .save()
    .then((resultado) => {
      res.redirect(req.baseUrl);
    })
    .catch((error) => {
      console.error(error);
      res.render("admin_error", { error: "Error insertando pelicula" });
    });
});

// Borrar pelicules
router.delete("/:id", autenticacio, (req, res) => {
  Pelicula.findByIdAndRemove(req.params.id)
    .then((resultado) => {
      res.redirect(req.baseUrl);
    })
    .catch((error) => {
      res.render("admin_error", { error: "Error borrando pelicula" });
    });
});

// Modificar pelicules
router.put("/:id", /* autenticacio ,*/ upload.single("imatge"), (req, res) => {
  Pelicula.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.file
        ? {
            titol: req.body.titol,
            sinopsi: req.body.sinopsi,
            duracio: req.body.duracio,
            valoracio: req.body.valoracio,
            genere: req.body.genere,
            imatge: req.file.filename,
            director: req.body.director,
          }
        : {
            titol: req.body.titol,
            sinopsi: req.body.sinopsi,
            duracio: req.body.duracio,
            valoracio: req.body.valoracio,
            genere: req.body.genere,
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
      res.render("admin_error", { error: "Error modificando pelicula" });
    });
});

module.exports = router;
