const express = require("express");
const router = express.Router();
const middleware = require("../middleware");

// importing controller
const adminController = require("../controllers/admin");

router.get("/admin", middleware.isAdmin, async (req, res, next) => { res.redirect(`/admin/${req.user.username}`)})

//admin -> dashboard
router.get("/admin/:username", middleware.isAdmin, adminController.getDashboard);

//admin -> delete profile
router.delete(
  "/admin/delete-profile",
  middleware.isAdmin,
  adminController.deleteProfile
);

//admin book inventory
router.get(
  "/admin/books/:filter/:value/:page",
  middleware.isAdmin,
  adminController.getBooks
);

// admin -> show searched books
router.post(
  "/admin/books/:filter/:value/:page",
  middleware.isAdmin,
  adminController.findBooks
);

//admin -> show books to be updated
router.get(
  "/admin/books/update/:book_id",
  middleware.isAdmin,
  adminController.getUpdateBook
);

//admin -> update book
router.post(
  "/admin/books/update/:book_id",
  middleware.isAdmin,
  adminController.postUpdateBook
);

//admin -> delete book
router.get(
  "/admin/books/delete/:book_id",
  middleware.isAdmin,
  adminController.getDeleteBook
);

//admin -> users list
router.get("/admin/users/:page", middleware.isAdmin, adminController.getUsers);

//admin -> show searched user
router.post(
  "/admin/users/:page",
  middleware.isAdmin,
  adminController.findUsers
);

//admin -> show one user
router.get(
  "/admin/users/profile/:user_id",
  middleware.isAdmin,
  adminController.getUserProfile
);

// admin -> delete a user
router.delete(
  "/admin/users/delete/:user_id",
  middleware.isAdmin,
  adminController.getDeleteUser
);

//admin -> add new book
router.get(
  "/admin/books/add",
  middleware.isAdmin,
  adminController.getAddNewBook
);

router.post(
  "/admin/books/add",
  middleware.isAdmin,
  adminController.postAddNewBook
);

//admin -> profile
router.get(
  "/admin/profile/:username",
  middleware.isAdmin,
  adminController.getAdminProfile
);

//admin -> update profile
router.put(
  "/admin/update-profile",
  middleware.isAdmin,
  adminController.postUpdateAdminProfile
);

//admin -> update password
router.put(
  "/admin/update-password",
  middleware.isAdmin,
  adminController.putUpdateAdminPassword
);

//admin -> show bills
router.get(
  "/admin/bills/:filter/:value/:page",
  middleware.isAdmin,
  adminController.getBills
);

//admin -> search bills
router.post(
  "/admin/bills/:filter/:value/:page",
  middleware.isAdmin,
  adminController.findBills
);

// router.get(
//   "/admin/bills/profile/:bill_id",
//   middleware.isAdmin,
//   adminController.getBillDetail
// );

//admin -> update bills (thay đổi trạng thái đang mượn -> đã trả hoặc quá hạn)
router.post(
  "/admin/bills/update/:bill_id",
  middleware.isAdmin,
  adminController.updateBill
);

module.exports = router;
