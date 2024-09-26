const express = require("express");
const router = express.Router();
const passport = require("passport");

// Import index controller
const authController = require("../controllers/auth");

// Import models

//landing page
router.get("/", authController.getLandingPage);

//admin login handler
router.get("/auth/admin/login", authController.getAdminLoginPage);

router.post(
  "/auth/admin/login",
  passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/auth/admin/login",
    failureFlash: true,
    successFlash: true
  }),
  (req, res, next) => {
  }
);

//admin logout handler
router.get("/auth/admin/logout", authController.getAdminLogout);

// admin sign up handler
router.get("/auth/admin/signup", authController.getAdminSignUp);

router.post("/auth/admin/signup", authController.postAdminSignUp);

//user login handler
router.get("/auth/user/login", authController.getUserLoginPage);

router.post(
  "/auth/user/login",
  passport.authenticate("local", {
    successRedirect: `/user`,
    failureRedirect: "/auth/user/login",
    successFlash: true,
    failureFlash: true
  }),
  (req, res) => {}
);

//user -> user logout handler
router.get("/auth/user/logout", authController.getUserLogout);

//user sign up handler
router.get("/auth/user/signup", authController.getUserSignUp);

router.post("/auth/user/signup", authController.postUserSignUp);

module.exports = router;
