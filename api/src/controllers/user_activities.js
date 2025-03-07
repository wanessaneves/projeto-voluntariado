//o controller vai lidar com as interações da requisição e encaminhá-las para os services que contêm essa lógica/regra de negócio.

//Receber a Requisição (Request), Validar a Requisição, Encaminhar a Requisição para o Service, Tratar Respostas, e Tratar erros.

const {
  createUserActivity,
  getActivitiesByUser,
  cancelActivity,
} = require("../services/user_activities");

// inscrição de usuário em atividade
//Essa função cria uma atividade para o usuário autenticado.
const create = async (req, res) => {
  const user = req.user; //Pega os dados do usuário autenticado do objeto
  const { id } = req.params; //Extrai o id dos parâmetros da URL

  try {
    const userActivity = await createUserActivity(user.id, id); //Chama a função createUserActivity(user.id, id)
    res.json(userActivity); //Retorna a atividade criada no formato JSON.
  } catch (err) {
    res.status(400).json({ error: err.message }); //Se ocorrer um erro, retorna um status 400 (Bad Request) com a mensagem do erro.
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

const cancel = async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  try {
    await cancelActivity(user.id, id);
    res.send(204).json();
  } catch (err) {
    res.status(400).json({ error: "erro ao cancelar inscrição" });
  }
};

module.exports = {
  create,
  myActivities,
  cancel,
};
