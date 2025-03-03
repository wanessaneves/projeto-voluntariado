const uuid = require("uuid");
const Database = require("../database");
const activityDB = new Database("activities");

const {
  listAllActivities,
  getActivityById,
} = require("../services/activities");

//Criação de atividade
const createActivity = (req, res) => {
  const { title, description, date, address, quantity } = req.body;

  if (!title || !description || !date || !address || !quantity) {
    return res.status(400).json({
      error: "title, description, date, address e quantity são obrigatórios",
    });
  }

  const id = uuid.v4();
  const newActivity = {
    id,
    title,
    description,
    date,
    address,
    quantity,
  };
  activityDB.put(`activity_${id}`, JSON.stringify(newActivity), (err) => {
    if (err) {
      res.status(500).json({ error: "Erro ao criar atividade" });
      return;
    }

    res.status(201).json(newActivity);
  });
};

//Detalhe da atividade
const detailActivity = (req, res) => {
  const { id } = req.params;
  const activity = getActivityById(activityDB, id);
  res.json(activity);
};

//Editar atividade
const updateActivity = (req, res) => {
  const { id } = req.params;
  const { title, description, date, address, quantity } = req.body;

  activityDB.get(`activity_${id}`, (err, value) => {
    if (err) {
      res.status(500).json({ error: "Erro ao editar atividade" });
      return;
    }

    const activity = JSON.parse(value.toString());

    const updatedAct = {
      id: activity.id,
      title: title || activity.title,
      description: description || activity.description,
      date: date || activity.date,
      address: address || activity.address,
      quantity: quantity || activity.quantity,
    };

    activityDB.put(`activity_${id}`, JSON.stringify(updatedAct), (err) => {
      if (err) {
        res.status(500).json({ error: "Erro ao atualizar atividade" });
        return;
      }

      res.json(updatedAct);
    });
  });
};

//Listagem de atividades
// TODO: precisa filtrar po atividades que tenha a data maior que hoje
const listActivity = (req, res) => {
  const activities = listAllActivities(activityDB);
  res.json(activities);
};

//Deletar atividade

const deleteActivity = (req, res) => {
  const { id } = req.params;

  activityDB.delete(`activity_${id}`, (err, value) => {
    if (err) {
      res.status(500).json({ error: "Erro ao excluír atividade" });
      return;
    }

    res.status(204).send();
  });
};

module.exports = {
  createActivity,
  detailActivity,
  updateActivity,
  listActivity,
  deleteActivity,
};
