const User = require("../models/userModel");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Order = require("../models/orderModel");
const { validationResult } = require("express-validator");
const { wallet } = require("./userController");

const adminloginpage = (req, res) => {
  res.render("adminlogin");
};

const logout = (req, res) => {
  res.render("adminlogin");
};



const adminlogin = async (req, res) => {
  try {
    const admin = await User.findOne({ isadmin: "1" });

    if (
      admin.email === req.body.email &&
      admin.password === req.body.password
    ) {
      //     const products=await Product.find({isDeleted:false})
      // const categories=await Category.find()
      // const orders=await Order.find()
      // const deliveredorders=await Order.find({status:'Delivered'})
      // let totalrevenue=0
      // deliveredorders.forEach((deliveredorders)=>{
      //   totalrevenue+=deliveredorders.total
      // })

      // res.render("dashboard",{products:products,categories:categories,orders:orders,totalrevenue:totalrevenue,deliveredorders:deliveredorders});
      res.redirect("/admin/dashboardpage");
    } else {
      res.render("adminlogin");
    }
  } catch {
    res.send("wrong details");
  }
};





const dashboardpage = async (req, res) => {
  const products = await Product.find({ isDeleted: false });
  const categories = await Category.find();
  const orders = await Order.find();
  const deliveredorders = await Order.find({ status: "Delivered" })
    .populate("user_id")
    .populate("product_id");

  let totalrevenue = 0;
  deliveredorders.forEach((deliveredorders) => {
    totalrevenue += deliveredorders.total;
  });

  res.render("dashboard", {
    products: products,
    categories: categories,
    orders: orders,
    totalrevenue: totalrevenue,
    deliveredorders: deliveredorders,
  });
};

const fetchChartData = async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      { $match: { status: "Delivered" } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%d-%m-%Y",
              date: { $toDate: "$delivery_date" },
            },
          },
          totalRevenue: { $sum: "$total" },
        },
      },
      { $sort: { _id: -1 } },
      { $project: { _id: 0, date: "$_id", totalRevenue: 1 } },
      { $limit: 5 },
    ]);

    const data = [];
    const date = [];
    for (const totalRevenue of salesData) {
      data.push(totalRevenue.totalRevenue);
    }

    for (const item of salesData) {
      date.push(item.date);
    }

    res.status(200).send({ data: data, date: date });
  } catch (error) {
    console.log(error.message);
  }
};





const orderdetails = async (req, res) => {
  try {
    const orderid = req.query.id;
    const order = await Order.findById({ _id: orderid })
      .populate("product_id")
      .populate("address_id");
    res.render("orderdetailsadmin", { order: order });
  } catch (error) {
    console.log(error.message);
  }
};





module.exports = {
  adminloginpage,
  logout,
  adminlogin,
  dashboardpage,
  fetchChartData,
  orderdetails,
  
  
};
