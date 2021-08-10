const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const userController = require("../controllers/user");

const {
  redirectAuthenticatedUser,
  redirectProtected
} = require("../utils/redirectMiddleware");

router.get("/registration", redirectAuthenticatedUser, userController.getRegistration)

router.post("/registration", redirectAuthenticatedUser, userController.postRegistration);

router.get("/login", redirectAuthenticatedUser, userController.getLogin);

router.post("/login", redirectAuthenticatedUser, userController.postLogin);

router.get("/logout", userController.getLogout);

router.get("/dashboard", redirectProtected, userController.getDashboard);

router.get("/adminDashboard", redirectProtected, userController.getAdminDashboard);

// router.get("/admin", userController.adminDashboard);

module.exports = router;
