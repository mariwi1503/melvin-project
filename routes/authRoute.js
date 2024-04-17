const router = require("express").Router(),
  authController = require("../controllers/authControlllers"),
  auth = require("../middleware/auth");

router.post("/auth/login", authController.login);
router.get("/auth/refresh", auth.refreshToken, authController.getNewToken);

module.exports = router;
