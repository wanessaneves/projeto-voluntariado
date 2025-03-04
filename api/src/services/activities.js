const uuid = require("uuid");

const Database = require("../database");
const activityDB = new Database("activities");

const listAllActivities = (all = false) => {
  return new Promise((resolve, reject) => {
    activityDB.readAllData((err, data) => {
      if (err) {
        reject(err);
      } else {
        const allActivities = data || [];

        if (!all) {
          const activities = allActivities.filter((activity) => {
            const today = new Date();
            const activityDate = new Date(activity.date);

            return today < activityDate;
          });

          resolve(activities);
        } else {
          resolve(allActivities);
        }
      }
    });
  });
};

const getActivityById = (id) => {
  return new Promise((resolve, reject) => {
    activityDB.get(`activity_${id}`, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data.toString()) || []);
      }
    });
  });
};

const deleteActivity = (id) => {
  return new Promise((resolve, reject) => {
    activityDB.delete(`activity_${id}`, (err, value) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const updateActivity = async (id, data) => {
  const activity = await getActivityById(id);

  if (!activity) {
    throw new Error("error ao atualizar atividade");
  }

  const quantity = data.quantity ? parseInt(data.quantity) : activity.quantity;
  const updatedAct = {
    id: activity.id,
    title: data.title || activity.title,
    description: data.description || activity.description,
    date: data.date || activity.date,
    address: data.address || activity.address,
    quantity,
  };

  return new Promise((resolve, reject) => {
    activityDB.put(`activity_${id}`, JSON.stringify(updatedAct), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(updatedAct);
      }
    });
  });
};

const createActivity = (data) => {
  const id = uuid.v4();
  const newActivity = {
    id,
    title: data.title,
    description: data.description,
    date: data.date,
    address: data.address,
    quantity: parseInt(data.quantity),
  };

  return new Promise((resolve, reject) => {
    activityDB.put(`activity_${id}`, JSON.stringify(newActivity), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(newActivity);
      }
    });
  });
};

module.exports = {
  listAllActivities,
  getActivityById,
  deleteActivity,
  updateActivity,
  createActivity,
};
