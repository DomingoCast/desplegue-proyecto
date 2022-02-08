const autenticacio = (req, res, next) => {
  if (req.session && req.session.usuario) return next();
  else res.render("auth_login");
};

module.exports = autenticacio;
