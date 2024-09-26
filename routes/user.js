// importing modules
const express = require("express");
const router = express.Router();
const middleware = require("../middleware");

// importing controller
const userController = require("../controllers/user");

router.get(
  "/user",
  middleware.isLoggedIn,
  async (req, res, next) => {
    if(req.user.isAdmin){
      res.redirect(`/admin/${req.user.username}`);
      return;
    }
    res.redirect(`/user/${req.user.username}`);
  }
)

// user -> dashboard
router.get(
  "/user/:username",
  middleware.isLoggedIn,
  userController.getUserDashboard
);

// user -> profile
router.get(
  "/user/:username/profile",
  middleware.isLoggedIn,
  userController.getUserProfile
);

//user -> update password
router.put(
  "/user/:username/update-password",
  middleware.isLoggedIn,
  userController.putUpdatePassword
);

//user -> update profile
router.put(
  "/user/:username/update-profile",
  middleware.isLoggedIn,
  userController.putUpdateUserProfile
);

// user -> delete user account
router.delete(
  "/user/:username/delete-profile",
  middleware.isLoggedIn,
  userController.deleteUserAccount
);

router.get(
  "/user/:username/books/:filter/:value/:page",
  middleware.isLoggedIn,
  userController.getBooks
)

router.post(
  "/user/:username/books/:filter/:value/:page",
  middleware.isLoggedIn,
  userController.findBooks
)

router.get(
  "/user/:username/books/detail/:book_id",
  middleware.isLoggedIn,
  userController.getBookDetail
)

router.post(
  "/user/:username/books/detail/:book_id",
  middleware.isLoggedIn,
  userController.postBorrowBook
)

router.get(
  "/user/:username/bills",
  middleware.isLoggedIn,
  userController.getBills
);

module.exports = router;
