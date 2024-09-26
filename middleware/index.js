const middleware = {};

middleware.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        // if(req.user.isAdmin){
        //     return req.flash("warning", "Tài khoản Admin không được phép sử dụng như một User thông thường. Vui lòng đăng nhập lại hoặc tạo mới tài khoản...");
        // }
        return next();
    }
    return req.flash("error", "Bạn cần đăng nhập để sử dụng dịch vụ của thư viện...");

};

middleware.isAdmin = function(req, res, next) {
    if(req.isAuthenticated() && req.user.isAdmin) {
        return next();
    }
    return req.flash("error", "Chỉ tài khoản Admin mới được phép sử dụng tài nguyên này...");
};

module.exports = middleware;