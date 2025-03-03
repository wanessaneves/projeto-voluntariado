const { Router } = require("express");

const { auth } = require("../middleware/auth");
const { admin } = require("../middleware/admin");

const routes = Router();

const userController = require("../controllers/users");
const activityController = require("../controllers/activities");

// auth routes
routes.post("/login", userController.login);

// user routes
routes.get("/users", admin, userController.listUsers);
routes.post("/users", userController.createUser);
routes.get("/users/:id", admin, userController.detailUser);
routes.put("/users/:id", auth, userController.updateUser);
routes.delete("/users/:id", auth, userController.deleteUser);

// activity routes
routes.get("/activities", auth, activityController.listActivity);
routes.post("/activities", admin, activityController.createActivity);
routes.get("/activities/:id", auth, activityController.detailActivity);
routes.put("/activities/:id", admin, activityController.updateActivity);
routes.delete("/activities/:id", admin, activityController.deleteActivity);

module.exports = routes;
