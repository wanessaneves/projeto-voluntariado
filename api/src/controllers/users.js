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

  if (!user) {
    return res.status(401).json({ error: "email ou senha incorretos" });
  }

  const passwordSuccess = await compare(password, user.password);

  if (!passwordSuccess) {
    return res.status(401).json({ error: "email ou senha incorretos" });
  }

  try {
    const token = jwt.sign({ user }, config.SECRET_KEY, {
      algorithm: "HS256",
      expiresIn: "1d",
    });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: "Erro ao autenticar usuário" });
  }
};

// listagem de usuário
const list = async (req, res) => {
  const users = await listAllUsers();
  res.json(users);
};

// criação de usuário
const create = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "name, email e password são obrigatórios" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "A senha precisa ter mais que 6 caracteres" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Email inválido" });
  }
  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ error: "Email já está em uso" });
    }
    const user = await createUser({ name, email, password });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: "erro ao criar usuário" });
  }
};

// detalhar um usuário
const detail = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await getUserById(id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: "usuário não encontrado" });
  }
};

// atualizar um usuário
const update = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (user.id !== id) {
    return res.status(403).json({ error: "você não pode realizar essa ação" });
  }

  if (password && password.length < 6) {
    return res
      .status(400)
      .json({ error: "A senha precisa ter mais que 6 caracteres" });
  }

  if (user.email !== email) {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ error: "Email já está em uso" });
    }
  }

  try {
    const userUpdated = await updateUser(id, { name, email, password });
    res.json(userUpdated);
  } catch (err) {
    res.status(400).json({ error: "erro ao atualizar usuário" });
  }
};

// excluir usuário
const destroy = async (req, res) => {
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
    await deleteUser(id);
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
