const uuid = require("uuid");
const Database = require("../database");
const userActivityDB = new Database("user_activities");

// inscrição de usuário em atividade
const createUserActivity = async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  const userActivityId = uuid.v4();
  const newUserActivity = {
    id: userActivityId,
    userId: user.id,
    activityId: id,
  };

  userActivityDB.readAllData((err, data) => {
    if (err) {
      res.status(500).json({ error: "Erro ao listar inscrições do usuário" });
      return;
    }

    const userActivityExists = data.find(
      (item) => item.activityId === id && item.userId === user.id
    );

    if (userActivityExists) {
      return res
        .status(400)
        .json({ error: "você já se inscreveu para essa atividade" });
    }

    const actvitity = data.find(
      (item) => item.activityId === id && item.userId === user.id
    );

    userActivityDB.put(
      `user_activity_${userActivityId}`,
      JSON.stringify(newUserActivity),
      (err) => {
        if (err) {
          res.status(500).json({ error: "Erro ao criar usuário" });
          return;
        }

        res.status(201).json(newUserActivity);
      }
    );
  });
};

module.exports = {
  createUserActivity,
};
