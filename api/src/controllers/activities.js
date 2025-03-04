const {
  listAllActivities,
  getActivityById,
  deleteActivity,
  updateActivity,
  createActivity,
} = require("../services/activities");
const { getAllMembersByActivityId } = require("../services/user_activities");

// Criação de atividade
const create = async (req, res) => {
  const { title, description, date, address, quantity } = req.body;

  if (!title || !description || !date || !address || !quantity) {
    return res.status(400).json({
      error: "title, description, date, address e quantity são obrigatórios",
    });
  }

  try {
    const activity = await createActivity({
      title,
      description,
      date,
      address,
      quantity,
    });

    res.json(activity);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "erro ao criar atividade" });
  }
};

// Detalhe da atividade
const detail = (req, res) => {
  const { id } = req.params;
  const activity = getActivityById(id);
  res.json(activity);
};

// Editar atividade
const update = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, address, quantity } = req.body;

  try {
    const activity = await updateActivity(id, {
      title,
      description,
      date,
      address,
      quantity,
    });
    res.json(activity);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "erro ao atualizar atividade" });
  }
};

//Listagem de atividades
const list = async (req, res) => {
  const user = req.user;
  const today = new Date();

  if (user.isAdmin) {
    const activities = await listAllActivities(true);
    res.json(activities);
  } else {
    const activities = await listAllActivities(false);
    const filteredActivities = activities.filter(
      (activity) => new Date(activity.date) > today
    );
    res.json(filteredActivities);
  }
};

// Deletar atividade
const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteActivity(id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: "Erro ao excluir atividade" });
  }
};

const listMembers = async (req, res) => {
  const { id } = req.params;
  const members = await getAllMembersByActivityId(id);
  res.json(members);
};

module.exports = {
  create,
  detail,
  update,
  list,
  destroy,
  listMembers,
};
