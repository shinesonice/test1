module.exports.isAdmin = (req, res, next) => {
  if (req.session.isAdmin) return next();
  console.log("Not isAdmin");
  res.send({ result: false });
  return;
};
module.exports.isAuth = (req, res, next) => {
  if (req.session.isLogin) return next();
  console.log("Not user");
  res.send({ result: false });
  return;
};
module.exports.isCounselor = (req, res, next) => {
  if (req.session.isCounselor) return next();
  console.log("Not isCounselor");
  res.send({ result: false });
  return;
};
