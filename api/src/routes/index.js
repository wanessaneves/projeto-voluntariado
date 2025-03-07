const { Router } = require("express");

const { auth } = require("../middleware/auth");
const { admin } = require("../middleware/admin");

const routes = Router();

const userController = require("../controllers/users");
const activityController = require("../controllers/activities");
const userActivityController = require("../controllers/user_activities");

// auth routes
routes.post("/login", userController.login);

// user routes
routes.get("/users", admin, userController.list);
routes.post("/users", userController.create);
routes.get("/users/:id", admin, userController.detail);
routes.put("/users/:id", auth, userController.update);
routes.delete("/users/:id", admin, userController.destroy);

// activity routes
routes.get("/activities", auth, activityController.list);
routes.get("/activities/members", admin, activityController.listMembers);
routes.post("/activities", admin, activityController.create);
routes.get("/activities/:id", auth, activityController.detail);
routes.put("/activities/:id", admin, activityController.update);
routes.delete("/activities/:id", admin, activityController.destroy);

// user activity routes
routes.post("/user-activities/:id", auth, userActivityController.create);
routes.get("/my-activities", auth, userActivityController.myActivities);
routes.delete("/user-activities/:id", auth, userActivityController.cancel);

module.exports = routes;
