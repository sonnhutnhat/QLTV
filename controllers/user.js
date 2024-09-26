// importing dependencies
const fs = require("fs");

// importing models
const User = require("../models/user");
const Book = require("../models/book");
const Bill = require("../models/bill");

// GLOBAL_VARIABLES
const PER_PAGE = 6;

//user -> dashboard
exports.getUserDashboard = async (req, res, next) => {
  const user_id = req.user._id;

  try {
    // fetch user info from db and populate it with related book issue
    const user = await User.findById(user_id);
    const bills_count = await Bill.find({
      "user.id": user_id,
    }).countDocuments();
    const bills_late_count = await Bill.find({
      "user.id": user_id,
      status: {$ne: 1},
    }).countDocuments();

    if (bills_late_count) {
      req.flash(
        "warning",
        `Bạn cần đem trả ${bills_late_count} quyển sách đã/sắp quá hạn mượn ngay lập tức.`
      );
    }

    res.render("user/index", {
      user: user,
      bills_count: bills_count,
    });
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};

// user -> profile
exports.getUserProfile = async (req, res, next) => {
  res.render("user/profile");
};

// user -> update/change password
exports.putUpdatePassword = async (req, res, next) => {
  const user_id = req.user._id;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.password;

  try {
    const user = await User.findById(user_id);
    await user.changePassword(oldPassword, newPassword);
    await user.save();
    req.flash(
      "success",
      "Your password is recently updated. Please log in again to confirm"
    );
    res.redirect("/auth/user/login");
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};

// user -> update profile
exports.putUpdateUserProfile = async (req, res, next) => {
  try {
    const userUpdateInfo = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      gender: req.body.gender,
      address: req.body.address,
    };
    await User.findByIdAndUpdate(req.user._id, userUpdateInfo);
    req.flash("success", "Cập nhật thông tin tài khoản thành công...");
    res.redirect("back");
  } catch (err) {
    console.log(err);
    req.flash("error", "Cập nhật thông tin thất bại...");
    return res.redirect("back");
  }
};

// user -> delete user account
exports.deleteUserAccount = async (req, res, next) => {
  try {
    const user_id = req.user._id;

    const user = await User.findById(user_id);
    const bills_late_count = await Bill.find({
      "user.id": user_id,
      status: -1,
    }).countDocuments();
    if (bills_late_count) {
      req.flash(
        "warning",
        "Bạn vẫn còn phiếu mượn quá hạn. Vui lòng trả sách trước khi xoá tài khoản này vĩnh viễn..."
      );
      return res.redirect("back");
    }
    await user.remove();

    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.redirect("back");
  }
};

// user -> get Book
exports.getBooks = async (req, res, next) => {
  try {
    let page = req.params.page || 1;
    const filter = req.params.filter.toLowerCase();
    const value = req.params.value;

    // console.log(`filter: ${filter}, value: ${value}`);
    // // constructing search object
    let searchObj = {};
    if (filter !== "all" && value !== "all") {
      // fetch books by search value and filter
      searchObj[filter] = { $regex: value, $options: "i" };
    }

    // get the book counts
    const books_count = await Book.find(searchObj).countDocuments();

    // fetching books
    const books = await Book.find(searchObj)
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE);

    // console.log(books, filter, value)a

    // rendering admin/bookInventory
    res.render("user/book/index", {
      books: books,
      current: page,
      pages: Math.ceil(books_count / PER_PAGE),
      filter: filter,
      value: value,
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "Có lỗi xảy ra trong quá trình tìm kiếm...");
    return res.redirect("back");
  }
};
// user -> search Book
exports.findBooks = async (req, res, next) => {
  try {
    let page = req.params.page || 1;
    const filter = req.body.filter.toLowerCase();
    const value = req.body.searchName;

    const searchObj = {};
    searchObj[filter] = { $regex: value, $options: "i" };

    // get the books count
    const books_count = await Book.find(searchObj).countDocuments();

    // fetch the books by search query
    const books = await Book.find(searchObj)
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE);

    console.log("Result:", books);
    // rendering admin/bookInventory
    res.render('user/book/index', {
      books: books,
      current: page,
      pages: Math.ceil(books_count / PER_PAGE),
      filter: filter,
      value: value,
      success: `Đã tìm thấy ${books_count} bản ghi...`,
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "Có lỗi xảy ra trong quá trình tìm kiếm...");
    return res.redirect("back");
  }
};
// user -> book Details
exports.getBookDetail = async (req, res, next) => {
  try {
    const book_id = req.params.book_id;
    console.log(book_id);
    const user = await User.findById(req.user._id);
    const book = await Book.findById(book_id);
    const bills_count = await Bill.find({
      "book.id": book_id,
    }).countDocuments();

    res.render("user/book/profile", {
      book: book,
      bills_count: bills_count,
      user: user
    });
  } catch (err) {
    console.log(err);
    req.flash({error: "Có lỗi xảy ra rồi nhè..."});
    return res.redirect("back");
  }
};
// user -> mượn sách
exports.postBorrowBook = async (req, res, next) => {
  try {
    const user_id = req.user._id;
    const username = req.user.username;
    const book_id = req.params.book_id;
    const book = await Book.findById(book_id);
    const user = await User.findById(user_id);

    const bill = new Bill({
      user: {
        id:  user_id,
        username: username,
      },
      book: {
        id: book_id,
        title: book.title
      }
    })

    await bill.save();

    //handle book
    book.remain_book -= 1;
    await book.save();

    // handle user
    user.point -= 1;
    user.bills.push({ bill_info: { id: bill._id } });
    user.save();

    req.flash("success", "Đã mượn sách thành công...");
    res.redirect(`/user/${user.username}/bills`);
  } catch (error) {
    console.log("error", error);
    req.flash({"error": "Đã xảy ra lỗi nào đó..."});
    res.redirect("back");
  }
}

exports.getBills = async (req, res, next) => {
  try {
    const user_id = req.user._id;
    const user = await User.findById(user_id);
    const bills = await Bill.find({
      "user.id": user_id,
      "status": { $ne: 1 },
    })
    res.render("user/bill/index", {
      user: user,
      bills: bills
    })
  } catch (error) {
    console.log(error);
  }
}


