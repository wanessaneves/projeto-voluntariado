const listAllActivities = (db) => {
  db.readAllData((err, data) => {
    if (err) {
      return [];
    }

    return data;
  });
};

const getActivityById = (db, id) => {
  db.get(`activity_${id}`, (err, value) => {
    if (err) {
      return null;
    }

    return JSON.parse(value.toString());
  });
};

module.exports = {
  listAllActivities,
  getActivityById,
};
