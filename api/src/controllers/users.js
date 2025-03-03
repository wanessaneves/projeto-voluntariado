const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const { hash, compare } = require("bcrypt");
const config = require("../config");
const Database = require("../database");
const userDB = new Database("users");

const { listAllUsers, getUserByEmail } = require("../services/users");

// login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({ error: "email ou senha incorretos" });
  }

  const user = getUserByEmail(userDB, email);
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
const listUsers = (req, res) => {
  const users = listAllUsers(userDB);
  res.json(users);
};

// criação de usuário
// TODO: verificar se o email está em uso
const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "name, email e password são obrigatórios" });
  }

  const id = uuid.v4();
  const hashedPassword = await hash(password, 8);
  const newUser = { id, name, email, password: hashedPassword, isAdmin: false };

  userDB.put(`user_${id}`, JSON.stringify(newUser), (err) => {
    if (err) {
      res.status(500).json({ error: "Erro ao criar usuário" });
      return;
    }

    res.status(201).json(newUser);
  });
};

// detalhar um usuário
const detailUser = (req, res) => {
  const { id } = req.params;

  userDB.get(`user_${id}`, (err, value) => {
    if (err) {
      res.status(500).json({ error: "Erro ao buscar usuário" });
      return;
    }

    res.json(value.toString());
  });
};

// atualizar um usuário
// TODO: verificar se o email está em uso
const updateUser = (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (user.id !== id) {
    return res.status(403).json({ error: "você não pode realizar essa ação" });
  }

  userDB.get(`user_${id}`, async (err, value) => {
    if (err) {
      res.status(500).json({ error: "Erro ao buscar usuário" });
      return;
    }
    const user = JSON.parse(value.toString());
    const hashedPassword = password ? await hash(password, 8) : user.password;
    const updatedUser = {
      id: user.id,
      name: name || user.name,
      email: email || user.email,
      password: hashedPassword,
      isAdmin: false,
    };

    userDB.put(`user_${id}`, JSON.stringify(updatedUser), (err) => {
      if (err) {
        res.status(500).json({ error: "Erro ao atualizar usuário" });
        return;
      }

      res.json(updatedUser);
    });
  });
};

// excluir usuário
const deleteUser = (req, res) => {
  const user = req.user;
  const { id } = req.params;

  if (id !== user.id) {
    if (!user.isAdmin) {
      return res
        .status(403)
        .json({ error: "você não pode realizar essa ação" });
    }
  }

  userDB.delete(`user_${id}`, (err, value) => {
    if (err) {
      res.status(500).json({ error: "Erro ao excluír usuário" });
      return;
    }

    res.status(204).send();
  });
};

module.exports = {
  login,
  listUsers,
  createUser,
  detailUser,
  updateUser,
  deleteUser,
};
