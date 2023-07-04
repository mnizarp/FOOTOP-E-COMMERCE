const express = require("express");
const user_Router = express();
const path = require("path");
require("dotenv").config();
user_Router.use(express.static("./public/user"));
user_Router.use(express.urlencoded({ extended: false }));
user_Router.use(express.json());
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const cartController = require("../controllers/cartController");
const orderController = require("../controllers/orderController");
const wishlistController = require("../controllers/wishlistController");
const addressController = require("../controllers/addressController");
const validation = require("../middleware/validationMiddleware");
user_Router.set("view engine", "ejs");
user_Router.set("views", "./views/user");
const flash = require("connect-flash");
user_Router.use(flash());
user_Router.use(express.static("./public"));
const nocache = require("nocache");
user_Router.use(nocache());
const MongoStore = require("connect-mongo");
const session = require("express-session");
user_Router.use(
  session({
    secret: "fiwafhiwfwhvuwvu9hvvvwv",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 999999999999999 },
    store: MongoStore.create({
      mongoUrl: "mongodb://0.0.0.0:27017/footopsignup",
    }),
  })
);

user_Router.get("/", userController.homepage);

user_Router.get("/login", userController.loginpage);

user_Router.get("/signup", userController.signuppage);

user_Router.post("/signup", validation.signupform, userController.add_newuser);

user_Router.get("/verify", userController.verifyMail);

user_Router.get("/backtologinpage", userController.backtologinpage);

user_Router.post("/loggedin", userController.userlogin);

user_Router.get("/products", productController.productspage);

user_Router.get("/productopen", productController.productopening);

user_Router.get("/logout", userController.logout);

user_Router.get("/otplogin", userController.otplogin);

user_Router.post("/otpemailsubmit", userController.otpemailsubmit);

user_Router.post("/otpsubmit", userController.otpsubmit);

user_Router.get("/kitproducts", productController.kitproducts);

user_Router.get("/bootproducts", productController.bootproducts);

user_Router.get("/ballproducts", productController.ballproducts);

user_Router.get("/accessoriesproducts", productController.accessoriesproducts);

user_Router.get("/opencart", cartController.opencart);

user_Router.get("/addtocart", cartController.addtocart);

user_Router.get("/removefromcart", cartController.removefromcart);

user_Router.post("/qtyplus", cartController.qtyplus);

user_Router.post("/qtyminus", cartController.qtyminus);

user_Router.get("/checkoutpage", orderController.checkoutpage);

user_Router.get("/profilepage", userController.profilepage);

user_Router.get("/editprofilepage", userController.editprofilepage);

user_Router.post("/profileedit",validation.profileedit,userController.profileedit);

user_Router.get("/changepasswordpage", userController.changepasswordpage);

user_Router.post("/changepassword",validation.changepassword,userController.changepassword);

user_Router.get("/addresspage", addressController.addresspage);

user_Router.get("/addnewaddress", addressController.addnewaddress);

user_Router.post("/addressadd",validation.addressadd,addressController.addressadd);

user_Router.get("/editaddresspage", addressController.editaddresspage);

user_Router.post("/editaddress",validation.editaddress,addressController.editaddress);

user_Router.get("/deleteaddress", addressController.deleteaddress);

user_Router.get("/checkvalidcoupon", userController.checkvalidcoupon);

user_Router.get("/orderspage", orderController.orderspage);

user_Router.post("/order", orderController.order);

user_Router.post("/razorpayorder", orderController.razorpayorder);

user_Router.post("/saveorder", orderController.saveorder);

user_Router.get("/orderdetails", orderController.orderdetails);

user_Router.get("/cancelorder", orderController.cancelorder);

user_Router.get("/returnorderpage", orderController.returnorderpage);

user_Router.get("/returnorder", orderController.returnorder);

user_Router.get("/wallet", userController.wallet);

user_Router.post("/searchproduct", productController.searchproduct);

user_Router.get("/openwishlist", wishlistController.openwishlist);

user_Router.get("/addtowishlist", wishlistController.addtowishlist);

user_Router.get("/removefromwishlist", wishlistController.removefromwishlist);

user_Router.post("/referalapply", userController.referalapply);

user_Router.post("/skipreferal", userController.skipreferal);

module.exports = user_Router;
