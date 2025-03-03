const listAllUsers = (db) => {
  db.readAllData((err, data) => {
    if (err) {
      return [];
    }

    return data;
  });
};

const getUserByEmail = (db, email) => {
  const allUsers = listAllUsers(db);
  const user = allUsers.find((item) => item.email === email);
  return user;
};

module.exports = {
  listAllUsers,
  getUserByEmail,
};
