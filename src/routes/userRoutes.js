const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/login", authController.login);

router.get(
  "/users",
  authController.protect,
  authController.restricTo("admin"),
  userController.getAllUsers
);

router.delete(
  "/:id",
  authController.protect,
  authController.restricTo("admin"),
  userController.deleteUser
);
module.exports = router;
