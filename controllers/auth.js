const User = require("../models/user");
const RoomChat = require("../models/room-chat");
const bcrypt = require("bcrypt");

const salt = 12;

module.exports.postSignUp = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const phone = req.body.phone;
  bcrypt.hash(password, salt, (err, hash) => {
    User.create({ name, email, password: hash, phone, cart: [] })
      .then((result) => {
        res.send({ result: true });
        return;
      })
      .catch((err) => console.log(err));
  });
};

module.exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  console.log(req.body);

  User.findOne({ email }).then((user) => {
    if (!user) {
      res.send({ result: false, emailIsIncorrect: true });
      return;
    }

    const hash = user.password;
    bcrypt.compare(password, hash, (err, result) => {
      if (!result) {
        res.send({ result: false, passwordIsIncorrect: true });
        return;
      }

      req.session.user = user;
      req.session.isLogin = true;
      if (user.role === "ADMIN") req.session.isAdmin = true;
      if (user.role === "COUNSELOR") req.session.isCounselor = true;

      RoomChat.create({ userId: req.session.user._id }).then((roomchat) => {
        req.session.roomchat = roomchat;
        req.session.save();
        res.send({
          result: true,
          email: email,
          name: user.name,
          isAdmin: req.session.isAdmin,
          isCounselor: req.session.isCounselor,
          isLogin: true,
        });
      });
    });
  });
};

module.exports.postLogout = (req, res, next) => {
  req.user = null;
  console.log("=> postLogout");
  RoomChat.findByIdAndDelete(req.session.roomchat._id).then((result) => {
    return req.session.destroy((err) => {
      res.send({ result: true });
    });
  });
};

module.exports.postAddMessage = (req, res, next) => {
  const isUser = req.body.isUser;
  const message = req.body.message;
  RoomChat.findByIdAndUpdate(req.session.roomchat._id).then((roomchat) => {
    roomchat.messages.push({ text: message, isUser });
    roomchat.save();
    const io = require("../socket").getIO();
    io.emit("message to admin", {
      message,
      isUser: true,
      roomId: req.session.roomchat._id,
    });
    res.send({ result: true });
  });
};

module.exports.getMessages = (req, res, next) => {
  console.log("=> getMessages");
  RoomChat.findById(req.session.roomchat._id).then((roomchat) => {
    res.send(roomchat);
  });
};

module.exports.getAutoLogin = (req, res, next) => {
  if (!req.session.isLogin) return res.send({ result: false });
  res.send({
    result: true,
    email: req.session.user.email,
    name: req.session.user.name,
    isAdmin: req.session.isAdmin,
    isCounselor: req.session.isCounselor,
    isLogin: true,
  });
};
