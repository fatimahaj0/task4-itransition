const express = require("express");
const { login, signup, logout, validatesession, getUsers, blockUser, UnblockUser, deleteUser, getUserName } = require('../controllers/user.controllers.js');

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/validate-session", validatesession)
router.get("/getUsers", getUsers)
router.get("/getUserName", getUserName)
router.post("/logout", logout)
router.post("/blockUser", blockUser)
router.post("/unblockUser", UnblockUser)
router.post("/deleteUser", deleteUser)
module.exports = router;
