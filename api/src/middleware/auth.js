const jwt = require("jsonwebtoken");
const config = require("../config");

const auth = (req, res, next) => {
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

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ error: "token inválido" });
  }
};

module.exports = {
  auth,
};
