const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
const RoomChat = require("../models/room-chat");

module.exports.getProducts = (req, res, next) => {
  Product.find().then((products) => {
    res.send(products);
  });
};

module.exports.getRoomChat = (req, res, next) => {
  RoomChat.find().then((roomchats) => {
    res.send(roomchats);
  });
};

module.exports.postAddMessage = (req, res, next) => {
  console.log("=> admin/postAddMessage");
  const isUser = req.body.isUser;
  const message = req.body.message;
  const roomId = req.body.roomId;
  console.log(req.body);
  RoomChat.findByIdAndUpdate(roomId).then((roomchat) => {
    roomchat.messages.push({ text: message, isUser: false });
    const io = require("../socket").getIO();
    io.emit("message to client", { roomId, message });
    roomchat.save();
    res.send({ result: true });
  });
};

module.exports.getDashBoard = (req, res, next) => {
  User.find({ role: "CLIENT" }).then((users) => {
    Order.find()
      .populate("userId")
      .then((orders) => {
        res.send({ orders, users });
      });
  });
};
