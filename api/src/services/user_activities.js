const uuid = require("uuid");

const { getActivityById, listAllActivities } = require("./activities");

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

const createUserActivity = async (userId, activityId) => {
  const activity = await getActivityById(activityId);

  const userActivityExists = await getUserActivityByUserAndActivity(
    userId,
    activityId
  );

  if (userActivityExists) {
    throw new Error("Você já está cadastrado nessa atividade");
  }

  const today = new Date();
  const activityDate = new Date(activity.date);

  if (today >= activityDate) {
    throw new Error("O período de inscrição nessa atividade foi encerrado");
  }

  const userActivityByActivity = await getUserActivityByActivity(activityId);

  if (userActivityByActivity.length >= activity.quantity) {
    throw new Error("Essa atividade atingiu o número de vagas disponíveis");
  }

  const userActivityId = uuid.v4();
  const newUserActivityData = {
    id: userActivityId,
    userId,
    activityId,
  };

  userActivityDB.put(
    `user_activity_${userActivityId}`,
    JSON.stringify(newUserActivityData),
    (err) => {
      if (err) {
        throw new Error("falha ao increver usuário na atividade");
      }

      return newUserActivityData;
    }
  );
};

module.exports = {
  listAllUserActivities,
  createUserActivity,
  getUserActivityByUserAndActivity,
  getUserActivityByActivity,
  getActivitiesByUser,
};
