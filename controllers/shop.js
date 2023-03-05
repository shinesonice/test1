const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");

const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "quangntfx19617@funix.edu.vn",
    pass: "quang212511610",
  },
});

const imgBanner = "http://localhost:5000/images/banner1.jpg";
const imgsTypeDevice = [
  "http://localhost:5000/images/product_1.png",
  "http://localhost:5000/images/product_2.png",
  "http://localhost:5000/images/product_3.png",
  "http://localhost:5000/images/product_4.png",
  "http://localhost:5000/images/product_5.png",
];

module.exports.getProducts = (req, res, next) => {
  Product.find().then((products) => {
    // console.log(products);
    res.send(products);
    return;
  });
};

module.exports.getBannerAndTypeDevice = (req, res, next) => {
  res.send({
    imgBanner,
    imgsTypeDevice,
  });
};

module.exports.getProduct = (req, res, next) => {
  const prodId = req.params.prodId;
  Product.findById(prodId).then((product) => {
    if (!product) return res.send({ error: true });

    Product.find({ category: product.category }).then((products) => {
      return res.send({ ...product._doc, ProductsRelated: products });
    });
  });
};

module.exports.postAddToCart = (req, res, next) => {
  const prodId = req.body.prodId;
  const qty = req.body.qty;
  User.findByIdAndUpdate(req.session.user._id).then((user) => {
    let haveProdInCart = false;
    const updatedCart = [...user.cart];
    console.log(updatedCart);
    for (let i = 0; i < updatedCart.length; i++) {
      if (updatedCart[i].prodId.toString() === prodId) {
        updatedCart[i].qty += qty;
        haveProdInCart = true;
        break;
      }
    }
    if (!haveProdInCart) updatedCart.push({ prodId, qty });
    user.cart = updatedCart;
    user.save();
  });
};

module.exports.getCart = (req, res, next) => {
  User.findById(req.session.user._id)
    .populate("cart.prodId")
    .then((user) => {
      res.send(user.cart);
    });
};

module.exports.postDeleteProductOfCart = (req, res, next) => {
  const prodId = req.body.prodId;

  User.findByIdAndUpdate(req.session.user._id).then((user) => {
    const updatedCart = [...user.cart];
    for (let i = 0; i < updatedCart.length; i++) {
      if (updatedCart[i].prodId.toString() === prodId) {
        updatedCart.splice(i, 1);
        console.log("deleted");
      }
    }
    user.cart = updatedCart;
    user.save();
  });
};

module.exports.postAddOrder = (req, res, next) => {
  const order = req.body;
  Order.create({ ...order, userId: req.session.user._id })
    .then((order) => {
      res.send({ result: true });
      User.findById(req.session.user._id)
        .then((user) => {
          user.cart = [];
          user.save();

          Order.findById(order._id)
            .populate("items.prodId")
            .then((order) => {
              let mailOptions = {
                from: "quangntfx19617@funix.edu.vn",
                to: order.email,
                subject: "Bill You Order",
                html: `<h2>Xin Chào ${order.fullName}</h2><h5>Phone: ${
                  order.phone
                }</h5><h5>address: ${
                  order.address
                }</h5> <table style="border-collapse: collapse;border: 1px solid;"><thead><tr><th>Tên Sản Phẩm</th><th>Hình Ảnh</th><th>Giá</th><th>Số Lượng</th><th>Thành Tiền</th></tr></thead><tbody>${order.items.reduce(
                  (string, item) => {
                    return `<tr><td style="text-align: center;">${
                      item.prodId.name
                    }</td><td style="text-align: center;"><img style="width:100px;" src="${
                      item.prodId.img1
                    }"/></td><td style="text-align: center;">${
                      item.prodId.price
                    } VND</td><td style="text-align: center;">${
                      item.qty
                    }</td><td style="text-align: center;">${
                      Number(item.prodId.price) * item.qty
                    }</td></tr>`;
                  },
                  ""
                )}</tbody></table><h2>Tổng Thanh Toán: ${
                  order.totalPrice
                }</h2><h3>Thời gian đặt: ${
                  [
                    order.createdAt.getMonth() + 1,
                    order.createdAt.getDate(),
                    order.createdAt.getFullYear(),
                  ].join("/") +
                  " " +
                  [
                    order.createdAt.getHours(),
                    order.createdAt.getMinutes(),
                    order.createdAt.getSeconds(),
                  ].join(":")
                }</h3><h4>Cảm ơn bạn!</h4>`,
              };
              console.log(mailOptions);

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log("err", error);
                } else {
                  console.log("Email sent: " + info.response);
                }
              });
            });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

module.exports.getOrders = (req, res, next) => {
  Order.find({ userId: req.session.user._id }).then((orders) => {
    res.send(orders);
    return;
  });
};

module.exports.getOrder = (req, res, next) => {
  Order.findById(req.body.orderId)
    .populate("items.prodId")
    .then((order) => {
      if (order.userId.toString() != req.session.user._id)
        return res.send({ result: false });
      res.send(order);
      return;
    });
};
