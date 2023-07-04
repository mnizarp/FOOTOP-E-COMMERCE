const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Cart = require("../models/cartModel");
const { validationResult } = require("express-validator");


// ---------------------USER-SIDE---------------------------------


// Enter allproduct page

const productspage = async (req, res) => {
    try {
      let page = 1;
  
      if (req.query.page) {
        page = req.query.page;
      }
  
      const limit = 8;
      const products = [];
      const allproducts = await Product.find({ isDeleted: false })
        .populate("category_id")
        .limit(limit)
        .skip((page - 1) * limit)
        .exec();
      for (let i = 0; i < allproducts.length; i++) {
        if (allproducts[i].category_id.list == 1) {
          products.push(allproducts[i]);
        }
      }
      const count = await Product.find({ isDeleted: false })
        .populate("category_id")
        .countDocuments();
  
      const categories = await Category.find({ list: 1 });
  
      const userId = req.session.userId;
      if (userId) {
        res.render("allproducts", {
          model: "1",
          products: products,
          categories: categories,
          totalpages: Math.ceil(count / limit),
          currentpage: Number(page),
        });
      } else {
        res.render("allproducts", {
          model: "0",
          products: products,
          categories: categories,
          totalpages: Math.ceil(count / limit),
          currentpage: page,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  // open a product
  
  const productopening = async (req, res) => {
    try {
      const id = req.query.id;
  
      const products = await Product.findById({ _id: id }).populate(
        "category_id"
      );
      const userId = req.session.userId;
      if (userId) {
        res.render("productinfo", { model: 1, products: products });
      } else {
        res.render("productinfo", { model: 0, products: products });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // show all products of kits category

const kitproducts = async (req, res) => {
    try {
      const category = await Category.findById({
        _id: "649e6c7c71af8a23c3a57ffe",
      });
  
      const products = await Product.find({
        // category_id: category[0]._id,
        category_id: "649e6c7c71af8a23c3a57ffe",
        isDeleted: false,
      }).populate("category_id");
  
      const userId = req.session.userId;
      if (userId) {
        res.render("productsbycategory", {
          model: "1",
          products: products,
          category: category.name,
        });
      } else {
        res.render("productsbycategory", {
          model: "0",
          products: products,
          category: category.name,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  // show all products of boots category
  
  const bootproducts = async (req, res) => {
    try {
      const category = await Category.findById({
        _id: "649e6c8471af8a23c3a58002",
      });
  
      const products = await Product.find({
        category_id: "649e6c8471af8a23c3a58002",
        isDeleted: false,
      }).populate("category_id");
  
      const userId = req.session.userId;
      if (userId) {
        res.render("productsbycategory", {
          model: "1",
          products: products,
          category: category.name,
        });
      } else {
        res.render("productsbycategory", {
          model: "0",
          products: products,
          category: category.name,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  // show all products of balls category
  
  const ballproducts = async (req, res) => {
    try {
      const category = await Category.findById({
        _id: "649e6c8b71af8a23c3a58006",
      });
  
      const products = await Product.find({
        category_id: "649e6c8b71af8a23c3a58006",
        isDeleted: false,
      }).populate("category_id");
      const userId = req.session.userId;
      if (userId) {
        res.render("productsbycategory", {
          model: "1",
          products: products,
          category: category.name,
        });
      } else {
        res.render("productsbycategory", {
          model: "0",
          products: products,
          category: category.name,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  // show all products of accessories category
  
  const accessoriesproducts = async (req, res) => {
    try {
      const category = await Category.findById({
        _id: "649e6c9371af8a23c3a5800a",
      });
  
      const products = await Product.find({
        category_id: "649e6c9371af8a23c3a5800a",
        isDeleted: false,
      }).populate("category_id");
  
      const userId = req.session.userId;
      if (userId) {
        res.render("productsbycategory", {
          model: "1",
          products: products,
          category: category.name,
        });
      } else {
        res.render("productsbycategory", {
          model: "0",
          products: products,
          category: category.name,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const searchproduct = async (req, res) => {
    try {
      let search = req.body.search;
      let products = await Product.find({
        $or: [
          { name: { $regex: ".*" + search + ".*", $options: "i" } },
          { description: { $regex: ".*" + search + ".*", $options: "i" } },
        ],
        isDeleted: false,
      });
  
      if (products.length > 0) {
        const userId = req.session.userId;
        if (userId) {
          res.render("searchresults", { model: "1", products: products });
        } else {
          res.render("searchresults", { model: "0", products: products });
        }
      } else {
        res.render("searchresults", { model: "1", products: products });
      }
    } catch (error) {
      console.log(error.message);
    }
  };


// ---------------------ADMIN-SIDE---------------------------------


  const add_newproduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const categories = await Category.find();
      return res.render("addproductpage", {
        categories: categories,
        errors: errors.array(),
      });
    }
    const arrImages = [];
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        arrImages.push(req.files[i].filename);
      }
    }
    const category = await Category.findOne({ name: req.body.category });
  
    const data = new Product({
      name: req.body.name,
      price: req.body.price,
      category_id: category._id,
      stock: req.body.stock,
      offerprice: 0,
      description: req.body.description,
      image: arrImages,
    });
  
    await data.save();
  
    const products = await Product.find({ isDeleted: false }).populate(
      "category_id"
    );
  
    res.render("productmgmt", { products: products });
  };
  
  const edit_productdetails = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const categories = await Category.find();
        const products = await Product.findById({ _id: req.body.id }).populate(
          "category_id"
        );
        return res.render("editproductpage", {
          categories: categories,
          products: products,
          errors: errors.array(),
        });
      }
      const product = await Product.find({ _id: req.body.id });
  
      let arrImages = [];
      if (req.files) {
        for (let i = 0; i < req.files.length; i++) {
          arrImages.push(req.files[i].filename);
        }
      }
      if (req.files.length == 0) {
        arrImages = product[0].image;
      }
  
      const category = await Category.findOne({ name: req.body.category });
  
      await Product.findByIdAndUpdate(
        { _id: req.body.id },
        {
          $set: {
            name: req.body.name,
            price: req.body.price,
            category: category._id,
            image: arrImages,
            stock: req.body.stock,
            description: req.body.description,
          },
        }
      );
  
      const products = await Product.find({ isDeleted: false }).populate(
        "category_id"
      );
  
      res.render("productmgmt", { products: products });
    } catch (error) {
      console.log(error.message);
    }
  };

  const productmgmtpage = async (req, res) => {
    try {
      const products = await Product.find({ isDeleted: false }).populate(
        "category_id"
      );
  
      res.render("productmgmt", { products: products });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const addproductpage = async (req, res) => {
    const categories = await Category.find();
  
    res.render("addproductpage", { categories: categories, errors: "" });
  };
  
  const canceladdproduct = async (req, res) => {
    try {
      const products = await Product.find({ isDeleted: false }).populate(
        "category_id"
      );
      res.render("productmgmt", { products: products });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const editproductpage = async (req, res) => {
    try {
      const categories = await Category.find();
  
      const id = req.query.id;
  
      const products = await Product.findById({ _id: id }).populate(
        "category_id"
      );
  
      res.render("editproductpage", {
        products: products,
        categories: categories,
        errors: "",
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const deleteproduct = async (req, res) => {
    try {
      const id = req.query.id;
      await Product.findByIdAndUpdate({ _id: id }, { $set: { isDeleted: true } });
      // await Order.deleteMany({ product_id: id });
      await Cart.deleteMany({ product_id: id });
      res.send({ message: "Product deleted successfully" });
      // const products = await Product.find().populate("category_id");
  
      // res.render("productmgmt", { products: products });
    } catch (error) {
      console.log(error.message);
    }
  };


  module.exports={
    productspage,
    productopening,
    kitproducts,
    bootproducts,
    ballproducts,
    accessoriesproducts,
    searchproduct,
    add_newproduct,
  edit_productdetails,
  productmgmtpage,
  addproductpage,
  canceladdproduct,
  editproductpage,
  deleteproduct,
  }
  