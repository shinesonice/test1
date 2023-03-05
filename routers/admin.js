const router = require("express").Router();
const isAdmin = require("../middleware/is-auth").isAdmin;
const isCounselor = require("../middleware/is-auth").isCounselor;

const AdminController = require("../controllers/admin");

router.get("/products", isAdmin, AdminController.getProducts);

router.get("/room-chat", isCounselor, AdminController.getRoomChat);

router.post("/add-message", isCounselor, AdminController.postAddMessage);

router.get("/dashboard", isAdmin, AdminController.getDashBoard);

module.exports = router;
