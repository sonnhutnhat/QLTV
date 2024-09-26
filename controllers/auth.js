// importing libraries
const passport = require("passport");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

// importing models
const User = require("../models/user");

exports.getLandingPage = async (req, res) => {
  return res.render("landing.ejs");
};

exports.getAdminLoginPage = (req, res, next) => {
  res.render("admin/login");
};

exports.getAdminLogout = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect("/");
  });
};

exports.getAdminSignUp = (req, res, next) => {
  res.render("admin/signup");
};

exports.postAdminSignUp = async (req, res, next) => {
  try {
    // console.log(req.body);
    if (req.body.adminCode === process.env.ADMIN_SECRET) {
      const newAdmin = new User({
        username: req.body.username,
        email: req.body.email,
        isAdmin: true,
      });

      // validate newAdmin

      const user = await User.register(newAdmin, req.body.password);
      await passport.authenticate("local")(req, res, () => {
        req.flash(
          "success",
          "Xin chào, " + user.username + " đã đến với giao diện Admin Dashboard"
        );
        res.redirect(`/admin/${user.username}`);
      });
    } else {
      req.flash("error", "Secret code không khớp!!!");
      return res.redirect("back");
    }
  } catch (err) {
    req.flash(
      "error",
      "Thông tin đăng ký giống với một người đã tồn tại. Vui lòng đăng ký lại với tên khác!!!"
    );
    return res.redirect("back");
  }
};

exports.getUserLoginPage = (req, res, next) => {
  res.render("user/login");
};

exports.getUserLogout = async (req, res, next) => {
  req.logout(async (err) => {
    if (err) return next(err);
    await req.session.destroy();
    res.redirect("/");
  });

};

exports.getUserSignUp = (req, res, next) => {
  res.render("user/signup");
};

exports.postUserSignUp = async (req, res, next) => {
  try {
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      gender: req.body.gender,
      address: req.body.address,
    });

    await User.register(newUser, req.body.password);
    await passport.authenticate("local")(req, res, () => {
      res.redirect(`/user/${newUser.username}`);
    });
  } catch (err) {
    req.flash(
      "error",
      "Thông tin đăng ký giống với một người đã tồn tại. Vui lòng đăng ký lại với tên khác!!!"
    );
    return res.redirect("back");
  }
};
