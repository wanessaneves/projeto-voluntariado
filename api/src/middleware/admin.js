const jwt = require("jsonwebtoken");
const config = require("../config");

const admin = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "token inválido" });
  }

  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    return res.status(401).json({ error: "token inválido" });
  }

  try {
    const { user } = jwt.verify(token, config.SECRET_KEY);

    if (!user.isAdmin) {
      return res.status(403).json({ error: "Usuário Não tem permissão!" });
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ error: "token inválido" });
  }
};

module.exports = {
  admin,
};
