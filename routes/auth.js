const express = require("express");
let router = express.Router();
// const usuarios = [
//   { usuario: "admin", password: "admin" },
//   { usuario: "casa", password: "perro" },
// ];
const Usuari = require("../models/usuari");

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.post("/login", (req, res) => {
  let login = req.body.login;
  let password = req.body.password;
  Usuari.find()
    .then((usuarios) => {
      let existeUsuario = usuarios.filter((usuario) => {
        console.log(usuario);
        return usuario.login == login && usuario.password == password;
      });
      console.log(existeUsuario);
      if (existeUsuario.length > 0) {
        req.session.usuario = existeUsuario[0].login;
        res.redirect("/pelicules");
      } else {
        res.render("auth_login", {
          error: true,
          message: "Usuario o contrasenya incorrectes",
        });
      }
    })
    .catch((error) => res.render("admin_error"));
});

module.exports = router;
