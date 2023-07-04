
const Category = require("../models/categoryModel");
const { validationResult } = require("express-validator");


const categorymgmtpage = async (req, res) => {
    try {
      const categories = await Category.find();
      res.render("categorymgmt", {
        categories: categories,
        errors: "",
        notice: "",
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const categoryadd = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const categories = await Category.find();
      return res.render("categorymgmt", {
        categories: categories,
        errors: errors.array(),
        notice: "",
      });
    }
    const data = new Category({
      name: req.body.name,
      list: 1,
    });
  
    const category = await Category.find({ name: req.body.name });
  
    if (category.length == 0) {
      await data.save();
  
      const categories = await Category.find();
  
      res.render("categorymgmt", {
        categories: categories,
        errors: "",
        notice: "",
      });
    } else {
      const categories = await Category.find();
      res.render("categorymgmt", {
        categories: categories,
        errors: "",
        notice: "Category already exists",
      });
    }
  };
  
  const editcategorypage = async (req, res) => {
    try {
      const id = req.query.id;
  
      const categories = await Category.findById({ _id: id });
  
      res.render("editcategorypage", {
        categories: categories,
        errors: "",
        notice: "",
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const categoryedit = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const categories = await Category.findById({ _id: req.body.id });
        return res.render("editcategorypage", {
          categories: categories,
          errors: errors.array(),
          notice: "",
        });
      }
      const thisid = req.body.id;
      const category = Category.find({ name: req.body.name });
      if ((await category).length == 0) {
        await Category.findByIdAndUpdate(
          { _id: req.body.id },
          { $set: { name: req.body.name } }
        );
        const categories = await Category.find();
        res.render("categorymgmt", {
          categories: categories,
          errors: "",
          notice: "",
        });
      } else {
        const categories = await Category.findById({ _id: thisid });
  
        res.render("editcategorypage", {
          categories: categories,
          errors: "",
          notice: "Category already exists",
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const list = async (req, res) => {
    try {
      const id = req.query.id;
  
      const category = await Category.findByIdAndUpdate(
        { _id: id },
        { $set: { list: 1 } }
      );
      if (category) {
        res.send({ message: "listed successfully" });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const unlist = async (req, res) => {
    try {
      const id = req.query.id;
  
      const category = await Category.findByIdAndUpdate(
        { _id: id },
        { $set: { list: 0 } }
      );
      if (category) {
        res.send({ message: "unlisted successfully" });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  module.exports={
    categorymgmtpage,
  categoryadd,
  editcategorypage,
  categoryedit,
  list,
  unlist,
  }