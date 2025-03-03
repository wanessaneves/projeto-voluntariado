const {
  listAllActivities,
  getActivityById,
  deleteActivity,
  updateActivity,
  createActivity,
} = require("../services/activities");

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
// TODO: precisa filtrar po atividades que tenha a data maior que hoje
const list = async (req, res) => {
  const user = req.user;

  if (user.isAdmin) {
    const activities = await listAllActivities(true);
    res.json(activities);
  } else {
    const activities = await listAllActivities(false);
    res.json(activities);
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

module.exports = {
  create,
  detail,
  update,
  list,
  destroy,
};
