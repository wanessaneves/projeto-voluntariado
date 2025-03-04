const uuid = require("uuid");
const { hash } = require("bcrypt");

const Database = require("../database");
const userDB = new Database("users");

const listAllUsers = () => {
  return new Promise((resolve, reject) => {
    userDB.readAllData((err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data || []);
      }
    });
  });
};

const getUserByEmail = async (email) => {
  try {
    const allUsers = await listAllUsers();
    const user = allUsers.find((item) => item.email === email);
    return user;
  } catch (err) {
    return null;
  }
};

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    userDB.get(`user_${id}`, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(value.toString()));
      }
    });
  });
};

const createUser = async (data) => {
  const id = uuid.v4();
  const hashedPassword = await hash(data.password, 8);
  const newUser = {
    id,
    name: data.name,
    email: data.email,
    password: hashedPassword,
    isAdmin: false,
  };

  return new Promise((resolve, reject) => {
    userDB.put(`user_${id}`, JSON.stringify(newUser), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(newUser);
      }
    });
  });
};

const updateUser = async (id, data) => {
  const user = getUserById(id);

  if (!user) {
    throw new Error("usuário não encontrado");
  }

  const hashedPassword = data.password
    ? await hash(data.password, 8)
    : user.password;
  const updatedUser = {
    id: user.id,
    name: data.name || user.name,
    email: data.email || user.email,
    password: hashedPassword,
    isAdmin: false,
  };

  userDB.put(`user_${id}`, JSON.stringify(updatedUser), (err) => {
    if (err) {
      throw new Error("Erro ao atualizar usuário");
    }

    return updatedUser;
  });
};

const deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    activityDB.delete(`user_${id}`, (err, value) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

module.exports = {
  listAllUsers,
  getUserByEmail,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
