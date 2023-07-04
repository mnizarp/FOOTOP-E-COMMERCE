const express = require("express");
const admin_Router = express();
const multer = require("multer");
const path = require("path");
const userController = require("../controllers/userController");
const adminController = require("../controllers/adminController");
const productController = require("../controllers/productController");
const cartController = require("../controllers/cartController");
const orderController = require("../controllers/orderController");
const categoryController = require("../controllers/categoryController");
const couponController = require("../controllers/couponController");
const offerController = require("../controllers/offerController");
const wishlistController = require("../controllers/wishlistController");
const addressController = require("../controllers/addressController");
const validation = require("../middleware/validationMiddleware");
admin_Router.set("view engine", "ejs");
admin_Router.set("views", "./views/Admin");
admin_Router.use(express.urlencoded({ extended: false }));
admin_Router.use(express.json());
admin_Router.use(express.static("./public/admin"));
admin_Router.use(express.static("./public"));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/upload"), function (err, success) {
      if (err) {
        throw err;
      }
    });
  },
  filename: function (req, file, cb) {
    const name = file.originalname;
    cb(null, name, function (err, success) {
      if (err) {
        throw err;
      }
    });
  },
});

const upload = multer({ storage: storage });

admin_Router.get("/", adminController.adminloginpage);

admin_Router.get('/logout',adminController.logout)

admin_Router.get("/usersmgmtpage", userController.usermgmtpage);

admin_Router.post("/blockuser", userController.blockuser);

admin_Router.post("/unblockuser", userController.unblockuser);

admin_Router.get("/dashboardpage", adminController.dashboardpage);

admin_Router.get('/chartData',adminController.fetchChartData)

admin_Router.get("/productmgmtpage", productController.productmgmtpage);

admin_Router.get("/addproductpage", productController.addproductpage);

admin_Router.get("/backtoproductmgmt", productController.canceladdproduct);

admin_Router.post("/productadd",upload.array("image"),validation.productadd, productController.add_newproduct);

admin_Router.get("/editproductpage", productController.editproductpage);

admin_Router.post("/productedit",upload.array("image"),validation.productadd,productController.edit_productdetails);

admin_Router.get("/deleteproduct", productController.deleteproduct);

admin_Router.get("/ordermgmtpage", orderController.ordermgmtpage);

admin_Router.get("/orderdetails", adminController.orderdetails);

admin_Router.post("/adminlogin", adminController.adminlogin);

admin_Router.get("/categorymgmtpage", categoryController.categorymgmtpage);

admin_Router.post("/categoryadd",validation.categoryadd, categoryController.categoryadd);

admin_Router.get("/editcategorypage", categoryController.editcategorypage);

admin_Router.post("/categoryedit",validation.categoryadd,  categoryController.categoryedit);

admin_Router.post("/list", categoryController.list);

admin_Router.post("/unlist", categoryController.unlist);

admin_Router.get("/couponmgmtpage", couponController.couponmgmtpage);

admin_Router.get("/addcouponpage", couponController.addcouponpage);

admin_Router.post("/couponadd",validation.couponadd, couponController.couponadd);

admin_Router.get("/editcouponpage", couponController.editcouponpage);

admin_Router.post("/couponedit",validation.couponadd, couponController.couponedit);

admin_Router.get("/backtocouponmgmt", couponController.backtocouponmgmt);

admin_Router.get("/deletecoupon", couponController.deletecoupon);

admin_Router.post("/updatestatus", orderController.updatestatus);

admin_Router.get("/returndetailspage", orderController.returndetailspage);

admin_Router.get("/returnsreasonspage", orderController.returnsreasonspage);

admin_Router.get("/returnapprove", orderController.returnapprove);

admin_Router.get("/offermgmtpage", offerController.offermgmtpage);

admin_Router.post("/createoffer", offerController.createoffer);

admin_Router.get("/removeoffer", offerController.removeoffer);

module.exports = admin_Router;
