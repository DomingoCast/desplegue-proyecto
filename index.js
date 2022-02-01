/*
Ejercicio de desarrollo de una web con Express, sobre la base de datos
de "pelicules" utilizada en sesiones anteriores. Se definirán distintas
vistas en Nunjucks para mostrar información de los pelicules y poderlos
insertar, borrar, etc.
*/

// Carga de librerías
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nunjucks = require("nunjucks");
const methodOverride = require("method-override");
const session = require("express-session");

// Enrutadores
const pelicules = require(__dirname + "/routes/pelicules");
const public = require(__dirname + "/routes/public");

// Conectar con BD en Mongo
mongoose.connect("mongodb://localhost:27017/pelicules2", {
  useNewUrlParser: true,
});

// Inicializar Express
let app = express();

//Security
app.use(
  session({
    secret: "1234",
    resave: true,
    saveUninitialized: false,
  })
);
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Configuramos motor Nunjucks
nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

// Asignación del motor de plantillas
app.set("view engine", "njk");

// Cargar middleware body-parser para peticiones POST y PUT
// y enrutadores
app.use(express.json());
app.use(express.urlencoded());
// Middleware para procesar otras peticiones que no sean GET o POST
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);
// Cargamos ahora también la carpeta "public" para el CSS propio
app.use("/public", express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/node_modules/bootstrap/dist"));
app.use("/pelicules", pelicules);
app.use("/", public); // Para la parte opcional

// Puesta en marcha del servidor
app.listen(8080);
