// middleware de autenticação e autorização usando JWT

const jwt = require("jsonwebtoken");
const config = require("../config");

const admin = (req, res, next) => {
  const { authorization } = req.headers; //Verifica se o token JWT está presente no cabeçalho da requisição.

  if (!authorization) {
    return res.status(401).json({ error: "token inválido" });
  }

  const [bearer, token] = authorization.split(" "); //dividindo a string em um array, utilizando o espaço.

  if (bearer !== "Bearer") {
    //Valida se o token é do tipo "Bearer" (padrão para autenticação com JWT).
    return res.status(401).json({ error: "token inválido" });
  }

  try {
    const { user } = jwt.verify(token, config.SECRET_KEY); //Decodifica o token JWT e extrai o usuário.

    if (!user.isAdmin) {
      //Verifica se o usuário tem permissão de administrador.
      return res.status(403).json({ error: "Usuário Não tem permissão!" });
    }

    req.user = user; //salvando o objeto user no contexto da requisição.Isso significa que qualquer função de middleware ou controlador que seguir pode acessar os dados do usuário através de req.user.

    next(); //Se for admin, passa para a próxima função (next).
  } catch (err) {
    return res.status(401).json({ error: "token inválido" });
  }
};

module.exports = {
  admin,
};
