const usuarios = [
  { usuario: "admin", password: "admin", rol: "admin" },
  { usuario: "casa", password: "perro", rol: "normal" },
];

const autenticacion = (req, res, next) => {
  if (req.session && req.session.usuario) return next();
  else res.render("login");
};

const rol = (rol) => {
  return (req, res, next) => {
    if (rol === req.session.rol) next();
    else res.render("login");
  };
};

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.post("/login", (req, res) => {
  let login = req.body.login;
  let password = req.body.password;
  let existeUsuario = usuarios.filter(
    (usuario) => usuario.usuario == login && usuario.password == password
  );
  if (existeUsuario.length > 0) {
    req.session.usuario = existeUsuario[0].usuario;
    req.session.rol = existeUsuario[0].rol;
    res.render("index");
  } else {
    res.render("login", { error: "Usuario o contraseña incorrectos" });
  }
});
