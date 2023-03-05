const router = require("express").Router();

const AuthController = require("../controllers/auth");

router.post("/login", AuthController.postLogin);
router.post("/signup", AuthController.postSignUp);
router.use("/logout", AuthController.postLogout);
router.use("/auto-login", AuthController.getAutoLogin);

router.use("/messages", AuthController.getMessages);

router.use("/add-message", AuthController.postAddMessage);

module.exports = router;
