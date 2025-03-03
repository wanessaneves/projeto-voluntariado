const jwt = require("jsonwebtoken");
const { compare } = require("bcrypt");
const config = require("../config");

const {
  listAllUsers,
  getUserByEmail,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../services/users");

// login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({ error: "email ou senha incorretos" });
  }

  const user = await getUserByEmail(email);
  const passwordSuccess = await compare(password, user.password);

  if (!passwordSuccess) {
    return res.status(401).json({ error: "email ou senha incorretos" });
  }

  try {
    const token = jwt.sign({ user }, config.SECRET_KEY, {
      algorithm: "HS256",
      expiresIn: "1d",
    });
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao autenticar usuário" });
  }
};

// listagem de usuário
const list = async (req, res) => {
  const users = await listAllUsers();
  res.json(users);
};

// criação de usuário
// TODO: verificar se o email está em uso
const create = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "name, email e password são obrigatórios" });
  }

  try {
    const user = await createUser({ name, email, password });
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "erro ao criar usuário" });
  }
};

// detalhar um usuário
const detail = (req, res) => {
  const { id } = req.params;

  const user = getUserById(id);

  if (!user) {
    return res.status(404).json({ error: "usuário não encontrado" });
  }

  res.json(user);
};

// atualizar um usuário
// TODO: verificar se o email está em uso
const update = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (user.id !== id) {
    return res.status(403).json({ error: "você não pode realizar essa ação" });
  }

  try {
    const userUpdated = await updateUser(id, { name, email, password });
    res.json(userUpdated);
  } catch (err) {
    res.status(400).json({ error: "erro ao atualizar usuário" });
  }
};

// excluir usuário
const destroy = (req, res) => {
  const user = req.user;
  const { id } = req.params;

  if (id !== user.id) {
    if (!user.isAdmin) {
      return res
        .status(403)
        .json({ error: "você não pode realizar essa ação" });
    }
  }

  try {
    deleteUser(id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: "erro ao excluir usuário" });
  }
};

module.exports = {
  login,
  list,
  create,
  detail,
  update,
  destroy,
};
