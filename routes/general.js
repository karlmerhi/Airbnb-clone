const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const generalController = require("../controllers/general");

router.get("/", generalController.getHome)

router.get("/rooms", generalController.getRooms);

module.exports = router;