const md5 = require("md5");
const User = require("../models/user.model");

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
