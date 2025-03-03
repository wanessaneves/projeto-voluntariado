const {
  createUserActivity,
  getActivitiesByUser,
} = require("../services/user_activities");

// inscrição de usuário em atividade
const create = async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  try {
    const userActivity = await createUserActivity(user.id, id);
    res.json(userActivity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const myActivities = async (req, res) => {
  const user = req.user;

  try {
    const activities = await getActivitiesByUser(user.id);
    res.json(activities);
  } catch (err) {
    res.json([]);
  }
};

module.exports = {
  create,
  myActivities,
};
