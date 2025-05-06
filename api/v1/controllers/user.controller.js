const md5 = require("md5");
const User = require("../models/user.model");
const ForgotPassword = require("../models/forgot-password.model");
const generateHelper = require("../../../helpers/generate");
const sendMailHelper = require("../../../helpers/sendMail");

// [POST] /user/register
module.exports.register = async (req, res) => {
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (!existEmail) {
    req.body.password = md5(req.body.password);
    const user = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      token: generateHelper.generateRandomString(30),
    });

    await user.save();

    const token = user.token;

    res.cookie("token", token);
    res.json({
      code: 200,
      message: "Đăng ký thành công!",
      user: user,
      token: token,
    });
  } else {
    res.json({
      code: 400,
      message: "Email đã tồn tại, đăng ký thất bại!",
    });
  }
};

// [POST] /user/login
module.exports.login = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (!user) {
    res.json({
      code: 400,
      message: "Không tồn tại email!",
    });
    return;
  }
  if (user.password != md5(req.body.password)) {
    res.json({
      code: 400,
      message: "Sai mật khẩu!",
    });
    return;
  }
  const token = user.token;
  res.cookie("token", token);
  res.json({
    code: 200,
    message: "Đăng nhập thành công!",
    token: token,
  });
};

// [POST] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    res.json({
      code: 400,
      message: "Email không tồn tại!",
    });
  }

  const otp = generateHelper.generateRandomNumber(8);
  const timeExpire = 5;

  // Lưu data vào database
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now() + timeExpire * 60 * 1000,
  };
  // console.log(objectForgotPassword);

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  // Gửi OTP qua cho user
  const subject = "Mã OTP để xác minh lấy lại mật khẩu";
  const html = `Mã OTP xác minh lấy lại mật khẩu của bạn là: <b>${otp}</b>.<br> Thời hạn sử dụng của mã là ${timeExpire} phút và lưu ý không được để lộ mã OTP`;
  sendMailHelper.sendMail(email, subject, html);
  res.json({
    code: 200,
    message: "Đã gửi mã OTP qua email!",
  });
};

// [POST] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const record = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });
  if (!record) {
    res.json({
      code: 400,
      message: "OTP không chính xác!",
    });
    return;
  }

  const user = await User.findOne({
    email: email,
  });
  const token = user.token;
  res.cookie("token", token);

  res.json({
    code: 200,
    message: "Xác thực thành công!",
    token: token,
  });
};

// [POST] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  const token = req.cookies.token;
  const password = req.body.password;

  const user = await User.findOne({
    token: token,
  });

  if (md5(password) === user.password) {
    res.json({
      code: 400,
      message: "Vui lòng đặt lại mật khẩu khác với mật khẩu cũ!",
    });
    return;
  }

  await User.updateOne({ token: token }, { password: md5(password) });
  res.json({
    code: 200,
    message: "Đặt lại mật khẩu thành công!",
  });
};

// [GET] /user/detail
module.exports.detail = async (req, res) => {
  res.json({
    code: 200,
    message: "Thành công!",
    info: req.user,
  });
};

// [GET] /user/list
module.exports.list = async (req, res) => {
  const users = await User.find({ deleted: false }).select("fullName email");
  res.json({
    code: 200,
    message: "Lấy danh sách người dùng thành công!",
    users: users,
  });
};
