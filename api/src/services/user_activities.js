const uuid = require("uuid");

const { getActivityById, listAllActivities } = require("./activities");
const { getUserById } = require("./users");

const Database = require("../database");
const userActivityDB = new Database("user_activities");

const listAllUserActivities = () => {
  return new Promise((resolve, reject) => {
    userActivityDB.readAllData((err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data || []);
      }
    });
  });
};

const getUserActivityByUserAndActivity = async (userId, activityId) => {
  try {
    const userActivities = await listAllUserActivities();
    const userActivity = userActivities.find(
      (ua) => ua.userId === userId && ua.activityId === activityId
    );

    return userActivity;
  } catch (err) {
    return null;
  }
};

const getUserActivityByActivity = async (activityId) => {
  try {
    const userActivities = await listAllUserActivities();
    const userActivitiesByActivity = userActivities.filter(
      (ua) => ua.activityId === activityId
    );

    return userActivitiesByActivity;
  } catch (err) {
    return [];
  }
};

const getUserActivityById = (id) => {
  return new Promise((resolve, reject) => {
    userDB.get(`user_activity_${id}`, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(value.toString()));
      }
    });
  });
};

const getActivitiesByUser = async (userId) => {
  try {
    const userActivities = await listAllUserActivities();
    const userActivitiesIds = userActivities
      .filter((ua) => ua.userId === userId)
      .map((item) => item.activityId);

    const allActivities = await listAllActivities();

    const activities = allActivities.filter((activity) =>
      userActivitiesIds.includes(activity.id)
    );

    console.log(activities);

    return activities;
  } catch (err) {
    return [];
  }
};

//inscrever um usuário em uma atividade,
const createUserActivity = async (userId, activityId) => {
  const activity = await getActivityById(activityId); //Busca os detalhes da atividade

  const userActivityExists = await getUserActivityByUserAndActivity(
    userId,
    activityId
  ); //Verifica se o usuário já está inscrito na atividade

  if (userActivityExists) {
    throw new Error("Você já está cadastrado nessa atividade");
  }

  const today = new Date().getUTCDate;
  const activityDate = new Date(activity.date);

  if (today >= activityDate) {
    throw new Error("O período de inscrição nessa atividade foi encerrado");
  } //Se a data atual (today) for maior ou igual à data da atividade

  const userActivityByActivity = await getUserActivityByActivity(activityId); //buscar todas as inscrições de usuários para uma determinada atividade.

  if (userActivityByActivity.length >= activity.quantity) {
    throw new Error("Essa atividade atingiu o número de vagas disponíveis");
  } //Verifica se a quantidade de inscritos é maior ou igual ao limite da atividade

  const userActivityId = uuid.v4(); //Gera um ID único para a inscrição
  const newUserActivityData = {
    id: userActivityId,
    userId,
    activityId,
  }; //Cria um novo objeto de inscrição

  userActivityDB.put(
    //Armazena os dados no banco de dados
    `user_activity_${userActivityId}`, // Chave de armazenamento
    JSON.stringify(newUserActivityData), // Converte os dados para JSON
    (err) => {
      if (err) {
        throw new Error("falha ao increver usuário na atividade");
      }

      return newUserActivityData; //// Retorna os dados da inscrição
    }
  );
};

const deleteUserActivity = (id) => {
  return new Promise((resolve, reject) => {
    activityDB.delete(`user_activity_${id}`, (err, value) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const cancelActivity = async (userId, userActivityId) => {
  const userActivity = await getUserActivityById(userActivityId);

  if (userActivity.userId !== userId) {
    throw new Error("essa incrição não pertence a você");
  }

  const activity = await getActivityById(userActivity.activityId);

  const today = new Date();
  const activityDate = new Date(activity.date);

  if (today >= activityDate) {
    throw new Error(
      "O período de cancelamento de inscrição dessa atividade não é permitido"
    );
  }

  await deleteUserActivity(userActivityId);
};

const getAllMembersByActivityId = async (activityId) => {
  const userActivities = await getUserActivityByActivity(activityId);

  const users = [];

  for await (const userActivity of userActivities) {
    const user = await getUserById(userActivity.userId);
    users.push(user);
  }

  return users;
};

module.exports = {
  listAllUserActivities,
  createUserActivity,
  getUserActivityByUserAndActivity,
  getUserActivityByActivity,
  getActivitiesByUser,
  getUserActivityById,
  deleteUserActivity,
  cancelActivity,
  getAllMembersByActivityId,
};
