// importing models
const Book = require("../models/book");
const User = require("../models/user");
const Bill = require("../models/bill");

// GLOBAL_VARIABLES
const PER_PAGE = 7;

exports.getDashboard = async (req, res, next) => {
  try {
    const users_count = (await User.find().countDocuments()) - 1;
    const books_count = await Book.find().countDocuments();
    const bills_count = await Bill.find().countDocuments();

    res.render("admin/index", {
      users_count: users_count,
      books_count: books_count,
      bills_count: bills_count,
    });
  } catch (err) {
    console.log(err);
    res.send("Không thể tải trang...");
  }
};

exports.deleteProfile = async (req, res, next) => {
  try {
    await User.findByIdAndRemove(req.user._id);
    req.flash({ success: `Bạn đã xoá tài khoản ${req.user._id} ...` })
    res.redirect("/");
  } catch (err) {
    console.log(err);
    req.flash(
      "error",
      "Không thể xoá tài khoản Admin này. Vui lòng thử lại hoặc liên hệ nhà phát triển để được hỗ trợ..."
    );
    return res.redirect("back");
  }
};

// get Books
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
    res.render("admin/bookManage/index", {
      books: books,
      current: page,
      pages: Math.ceil(books_count / PER_PAGE),
      filter: filter,
      value: value,
    });
  } catch (err) {
    console.log(err);
    req.flash({ "error": "Lỗi tải trang..." })
    return res.redirect("back");
  }
};

// admin -> return book inventory by search query working procedure
/*
    same as getAdminBookInventory method
*/
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

    // rendering admin/bookInventory
    res.render(`admin/bookManage/index`, {
      books: books,
      current: page,
      pages: Math.ceil(books_count / PER_PAGE),
      filter: filter,
      value: value,
      success: `Đã tìm thấy ${books_count} bản ghi...`,
    });
  } catch (err) {
    console.log(err);
    req.flash({ "error": "Lỗi tải trang..." })
    return res.redirect("back");
  }
};

// admin -> get the book to be updated
exports.getUpdateBook = async (req, res, next) => {
  try {
    const book_id = req.params.book_id;
    const book = await Book.findById(book_id);

    res.render(`admin/bookManage/updateBook`, {
      book: book,
    });
  } catch (err) {
    console.log(err);
    req.flash({ "error": "Lỗi tải trang..." })
    return res.redirect("back");
  }
};

// admin -> post update book
exports.postUpdateBook = async (req, res, next) => {
  try {
    const book_info = req.body.book;
    const book_id = req.params.book_id;

    await Book.findByIdAndUpdate(book_id, book_info);

    console.log("update thành công...");
    req.flash({
      "success": `Cập nhật dữ liệu sách ${book_id} thành công...`,
    });

    res.redirect("/admin/books/all/all/1");
  } catch (err) {
    console.log(err);
    req.flash({ error: "Cập nhật thất bại, vui lòng thử lại..." });
    res.redirect("back");
  }
};

// admin -> delete book
exports.getDeleteBook = async (req, res, next) => {
  try {
    const book_id = req.params.book_id;

    const book = await Book.findById(book_id);
    await book.remove();

    req.flash("success", `Đã xoá sách ${book_id} thành công...`);
    res.redirect("back");
  } catch (err) {
    console.log(err);
    req.flash({ error: "Đã xảy ra lỗi trong quá trình xoá..." });
    res.redirect("back");
  }
};

// admin -> get user list
exports.getUsers = async (req, res, next) => {
  try {
    const page = req.params.page || 1;

    const users = await User.find()
      .sort("-joined")
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE);

    const users_count = await User.find().countDocuments();

    res.render(`admin/userManage/index`, {
      users: users,
      current: page,
      pages: Math.ceil(users_count / PER_PAGE),
    });
  } catch (err) {
    console.log(err);
    req.flash({
      error: "Xảy ra lỗi trong quá trình hiển thị dữ liệu..."
    });
    res.redirect("back");
  }
};

// admin -> show searched user
exports.findUsers = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const searchField = req.body.searchUser;
    const search_value = { $regex: searchField, $options: "i" };
    const users = await User.find({
      $or: [
        { firstName: search_value },
        { lastName: search_value },
        { username: search_value },
        { email: search_value },
      ],
    })
      .sort("-joined")
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE);

    const users_count = await User.find({
      $or: [
        { firstName: search_value },
        { lastName: search_value },
        { username: search_value },
        { email: search_value },
      ],
    }).countDocuments();

    res.render("admin/userManage/index", {
      users: users,
      current: page,
      pages: Math.ceil(users_count / PER_PAGE),
      value: req.body.searchUser,
      success: `Đã tìm thấy ${users_count} người dùng...`,
    });
  } catch (err) {
    console.log(err);
    req.flash({
      error: "Xảy ra lỗi trong quá trình tìm kiếm người dùng này",
    });
    res.redirect("back");
  }
};

// admin -> show one user
exports.getUserProfile = async (req, res, next) => {
  try {
    const user_id = req.params.user_id;

    const user = await User.findById(user_id);
    const user_bills_count = await Bill.find({
      "user.id": user_id,
    }).countDocuments();

    res.render(`admin/userManage/profile`, {
      user: user,
      user_bills_count: user_bills_count,
    });
  } catch (err) {
    console.log(err);
    req.flash({
      error: "Đã xảy ra lỗi trong quá trình hiển thị dữ liệu...",
    });
    res.redirect("back");
  }
};

// admin -> delete a user
exports.getDeleteUser = async (req, res, next) => {
  try {
    const user_id = req.params.user_id;
    const user = await User.findById(user_id);
    await user.remove();

    await Bill.deleteMany({ "user.id": user_id });

    res.redirect("/admin/users/1", {
      success: `Đã xoá tài khoản ${user_id} thành công...`,
    });
  } catch (err) {
    console.log(err);
    req.flash({
      error: `Xảy ra lỗi trong quá trình xoá tài khoản ${user_id}...`,
    });
    res.redirect("back");
  }
};

// admin -> add new book
exports.getAddNewBook = (req, res, next) => {
  res.render("admin/bookManage/addBook");
};

exports.postAddNewBook = async (req, res, next) => {
  try {
    const book_info = req.body.book;

    console.log(book_info);

    if (
      isNaN(book_info.total) ||
      book_info.total < 1 ||
      book_info.total % 1 !== 0
    ) {
      req.flash("error", "This total book field is incorrect.");
      return res.redirect("back");
    } else if (!book_info.published_at || book_info >= Date.now()) {
      console.log("published at incorrect...");
      req.flash({ error: "This Published At field is incorrect." });
      return res.redirect("back");
    }

    console.log(book_info);

    const isDuplicate = await Book.find(book_info);

    if (isDuplicate.length > 0) {
      req.flash("error", "This book is already registered in inventory");
      return res.redirect("back");
    }

    book_info["remain_book"] = book_info.total_book;

    const new_book = new Book(book_info);
    await new_book.save();
    req.flash(
      "success",
      `A new book named ${new_book.title} is added to the inventory`
    );
    res.redirect("/admin/books/all/all/1");
  } catch (err) {
    console.log(err);
    req.flash({
      error: "Thêm sách mới thất bại. Vui lòng thao tác lại...",
    });
    res.redirect("back");
  }
};

// admin -> get profile
exports.getAdminProfile = (req, res, next) => {
  res.render("admin/profile");
};

// admin -> update profile
exports.postUpdateAdminProfile = async (req, res, next) => {
  try {
    const user_id = req.user._id;
    const update_info = req.body.admin;

    await User.findByIdAndUpdate(user_id, update_info);
    req.flash({ success: "Cập nhật thông tin thành công..." });
    // res.redirect(`/admin`);
  } catch (err) {
    console.log(err);
    req.flash({ error: "Cập nhật thất bại..." });
    res.redirect("back");
  }
};

// admin -> update password
exports.putUpdateAdminPassword = async (req, res, next) => {
  try {
    const user_id = req.user._id;
    const old_password = req.body.oldPassword;
    const new_password = req.body.password;

    const admin = await User.findById(user_id);
    await admin.changePassword(old_password, new_password);
    await admin.save();

    req.flash(
      "success",
      "Your password is changed done. Please login again to continue..."
    );
    res.redirect("/auth/admin/login");
  } catch (err) {
    console.log(err);
    req.flash({
      error:
        "Sai mật khẩu cũ hoặc có lỗi trong quá trình thay đổi mật khẩu mới. Vui lòng thử lại sau..."
    });
    res.redirect("back");
  }
};

exports.getBills = async (req, res, next) => {
  try {
    let page = req.params.page || 1;
    const filter = req.params.filter.toLowerCase();
    const value = req.params.value;

    let searchObj = {};

    if (filter !== "all" && value !== "all") {
      searchObj[filter] = { $regex: value, $options: "i" };
    }

    const bills_count = await Bill.find(searchObj).countDocuments();

    const bills = await Bill.find(searchObj)
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE);

    res.render("admin/billManage/index.ejs", {
      bills: bills,
      current: page,
      pages: Math.ceil(bills_count / PER_PAGE),
      filter: filter,
      value: value,
    });
  } catch (err) {
    console.log(err);
    req.flash({
      error: "Xảy ra lỗi trong quá trình tải dữ liệu...",
    });
    return res.redirect("back");
  }
};

exports.findBills = async (req, res, next) => {
  try {
    let page = req.params.page || 1;
    const filter = req.body.filter.toLowerCase();
    const value = req.body.searchName;
    console.log(filter, value);

    let searchObj = {};
    if (filter === "user") {
      searchObj["user.username"] = {
        $regex: value,
        $options: "i"
      };
    } else {
      searchObj["book.title"] = {
        $regex: value,
        $options: "i"
      }
    };

    const bills_count = await Bill.find(searchObj).countDocuments();

    const bills = await Bill.find(searchObj)
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE);

    res.render(`admin/billManage/index`, {
      bills: bills,
      current: page,
      pages: Math.ceil(bills_count / PER_PAGE),
      filter: filter,
      value: value,
      success: `Đã tìm thấy ${bills_count} bản ghi...`,
    });
  } catch (err) {
    console.log(err);
    req.flash({
      error: "Có lỗi xảy ra trong quá trình tìm kiếm...",
    });
    return res.redirect("back");
  }
};

exports.updateBill = async (req, res, next) => {
  try {
    const status = req.body;
    const bill_id = req.params.bill_id;

    if (status.status === '1') {
      status.returnDate = Date.now();
    }

    console.log(status);

    await Bill.findByIdAndUpdate(bill_id, status);

    console.log("thành công");
    req.flash("success", "Cập nhật trạng thái phiếu thành công...");
    res.redirect("back");

  } catch (error) {
    console.log(error);
    req.flash("error", "Cập nhật trạng thái thất bại...");
    res.redirect("back");
  }
  // res.send("Đang suy nghĩ tính năng này...");
};
