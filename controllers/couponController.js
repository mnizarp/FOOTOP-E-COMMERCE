
const Category = require("../models/categoryModel");
const Coupon = require("../models/couponModel");
const { validationResult } = require("express-validator");

const couponmgmtpage = async (req, res) => {
    const coupons = await Coupon.find().populate("discount_category");
  
    res.render("couponmgmt", { coupons: coupons });
  };
  
  const addcouponpage = async (req, res) => {
    const categories = await Category.find();
    res.render("addcouponpage", {
      categories: categories,
      errors: "",
      notice: "",
    });
  };
  
  const couponadd = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const categories = await Category.find();
        return res.render("addcouponpage", {
          categories: categories,
          errors: errors.array(),
          notice: "",
        });
      }
      const category = await Category.findOne({
        name: req.body.discount_category,
      });
  
      if (req.body.discount_price < req.body.min_purchase) {
        const data = new Coupon({
          code: req.body.code,
          discount_price: req.body.discount_price,
          discount_category: category._id,
          min_purchase: req.body.min_purchase,
          expiry: req.body.expiry,
        });
  
        await data.save();
        const coupons = await Coupon.find().populate("discount_category");
        res.render("couponmgmt", { coupons: coupons });
      } else {
        const categories = await Category.find();
        res.render("addcouponpage", {
          categories: categories,
          errors: "",
          notice: "Discount price should be less than Min purchase amount",
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const editcouponpage = async (req, res) => {
    try {
      const categories = await Category.find();
  
      const id = req.query.id;
  
      const coupon = await Coupon.findById({ _id: id }).populate(
        "discount_category"
      );
  
      res.render("editcouponpage", {
        coupon: coupon,
        categories: categories,
        errors: "",
        notice: "",
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const couponedit = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const categories = await Category.find();
        const coupon = await Coupon.findById({ _id: req.body.id }).populate(
          "discount_category"
        );
        return res.render("editcouponpage", {
          categories: categories,
          coupon: coupon,
          errors: errors.array(),
          notice: "",
        });
      }
      const category = await Category.findOne({
        name: req.body.discount_category,
      });
  
      if (req.body.discount_price < req.body.min_purchase) {
        await Coupon.findByIdAndUpdate(
          { _id: req.body.id },
          {
            $set: {
              code: req.body.code,
              discount_price: req.body.discount_price,
              discount_category: category._id,
              min_purchase: req.body.min_purchase,
              expiry: req.body.expiry,
            },
          }
        );
  
        const coupons = await Coupon.find().populate("discount_category");
        res.render("couponmgmt", { coupons: coupons });
      } else {
        const categories = await Category.find();
  
        const id = req.body.id;
  
        const coupon = await Coupon.findById({ _id: id }).populate(
          "discount_category"
        );
  
        res.render("editcouponpage", {
          coupon: coupon,
          categories: categories,
          errors: "",
          notice: "Discount price should be less than min purchase amount",
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const backtocouponmgmt = async (req, res) => {
    const coupons = await Coupon.find().populate("discount_category");
  
    res.render("couponmgmt", { coupons: coupons });
  };
  
  const deletecoupon = async (req, res) => {
    try {
      const id = req.query.id;
      await Coupon.deleteOne({ _id: id });
      res.send({ message: "Coupon deleted successfully" });
      // const coupons = await Coupon.find().populate("discount_category");
  
      // res.render("couponmgmt", { coupons: coupons });
    } catch (error) {
      console.log(error.message);
    }
  };

  module.exports={
    couponmgmtpage,
  addcouponpage,
  couponadd,
  editcouponpage,
  couponedit,
  backtocouponmgmt,
  deletecoupon,
  }