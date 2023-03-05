const router = require("express").Router();
const ShopController = require("../controllers/shop");

const isAuth = require("../middleware/is-auth").isAuth;

router.use("/products", ShopController.getProducts);
router.use("/imgs", ShopController.getBannerAndTypeDevice);
router.use("/product/:prodId", ShopController.getProduct);
router.post("/add-cart", isAuth, ShopController.postAddToCart);
router.get("/cart", isAuth, ShopController.getCart);
router.post(
  "/delete-item-cart",
  isAuth,
  ShopController.postDeleteProductOfCart
);

router.post("/add-order", isAuth, ShopController.postAddOrder);

router.get("/orders", isAuth, ShopController.getOrders);

router.use("/order", isAuth, ShopController.getOrder);

module.exports = router;
