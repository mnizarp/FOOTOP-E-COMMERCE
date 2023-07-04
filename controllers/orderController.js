const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Address = require("../models/addressModel");
const Order = require("../models/orderModel");
const Return = require("../models/returnModel")
const Returned = require("../models/returnedModel");
const Razorpay = require("razorpay");
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;
const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_ID_KEY,
  key_secret: RAZORPAY_SECRET_KEY,
});



// ================USER-SIDE===============================



// entering to checkout page

const checkoutpage = async (req, res) => {
    try {
      const userid = req.session.userId;
  
      const addresses = await Address.find({ user_id: userid });
      const cartproducts = await Cart.find({ user_id: userid }).populate(
        "product_id"
      );
      const coupons = await Coupon.find().populate("discount_category");
      if (addresses.length == 0) {
        res.redirect("/addnewaddress");
      } else if (cartproducts.length == 0) {
        res.redirect("/opencart");
      } else {
        res.render("checkoutpage", {
          model: "1",
          addresses: addresses,
          cartproducts: cartproducts,
          coupons: coupons,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // entering to orders page

const orderspage = async (req, res) => {
    try {
      const orders = await Order.find({ user_id: req.session.userId })
        .populate("product_id")
        .populate("address_id");
  
      res.render("orders", {
        model: "1",
        orders: orders,
        message: req.flash("message"),
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  // order placing via COD
  
  const order = async (req, res) => {
    const cartproducts = await Cart.find({
      user_id: req.session.userId,
    }).populate("product_id");
  
    if (req.body.paymentmethod == "COD") {
      for (let i = 0; i < cartproducts.length; i++) {
        if (cartproducts[i].product_id.offerprice == 0) {
          const order = new Order({
            user_id: req.session.userId,
            product_id: cartproducts[i].product_id._id,
            address_id: req.body.address,
            quantity: cartproducts[i].quantity,
            total: cartproducts[i].quantity * cartproducts[i].product_id.price,
            order_date: new Date().toLocaleDateString(),
            payment_method: "COD",
            coupon_code: req.body.couponcode,
            status: "Pending",
            return_reason: "",
            delivery_date: "",
          });
          await order.save();
        } else {
          const order = new Order({
            user_id: req.session.userId,
            product_id: cartproducts[i].product_id._id,
            address_id: req.body.address,
            quantity: cartproducts[i].quantity,
            total:
              cartproducts[i].quantity * cartproducts[i].product_id.offerprice,
            order_date: new Date().toLocaleDateString(),
            payment_method: "COD",
            coupon_code: req.body.couponcode,
            status: "Pending",
            return_reason: "",
            delivery_date: "",
          });
          await order.save();
        }
  
        await Product.findByIdAndUpdate(
          { _id: cartproducts[i].product_id._id },
          {
            $set: {
              stock: cartproducts[i].product_id.stock - cartproducts[i].quantity,
            },
          }
        );
      }
  
      await Cart.deleteMany({ user_id: req.session.userId });
    } else if (req.body.paymentmethod == "Wallet") {
      let carttotal = 0;
      for (let i = 0; i < cartproducts.length; i++) {
        if (cartproducts[i].product_id.offerprice == 0) {
          carttotal +=
            cartproducts[i].quantity * cartproducts[i].product_id.price;
        } else {
          carttotal +=
            cartproducts[i].quantity * cartproducts[i].product_id.offerprice;
        }
      }
  
      const coupon = await Coupon.find({ code: req.body.couponcode });
      let total;
      if (coupon.length > 0) {
        let discount = coupon[0].discount_price;
        total = carttotal - discount;
      } else {
        total = carttotal;
      }
  
      const user = await User.findById({ _id: req.session.userId });
  
      if (total <= user.wallet) {
        for (let i = 0; i < cartproducts.length; i++) {
          if (cartproducts[i].product_id.offerprice == 0) {
            const order = new Order({
              user_id: req.session.userId,
              product_id: cartproducts[i].product_id._id,
              address_id: req.body.address,
              quantity: cartproducts[i].quantity,
              total: cartproducts[i].quantity * cartproducts[i].product_id.price,
              order_date: new Date().toLocaleDateString(),
              payment_method: "Wallet",
              coupon_code: req.body.couponcode,
              status: "Pending",
              return_reason: "",
              delivery_date: "",
            });
            await order.save();
          } else {
            const order = new Order({
              user_id: req.session.userId,
              product_id: cartproducts[i].product_id._id,
              address_id: req.body.address,
              quantity: cartproducts[i].quantity,
              total:
                cartproducts[i].quantity * cartproducts[i].product_id.offerprice,
              order_date: new Date().toLocaleDateString(),
              payment_method: "Wallet",
              coupon_code: req.body.couponcode,
              status: "Pending",
              return_reason: "",
              delivery_date: "",
            });
            await order.save();
          }
  
          await Product.findByIdAndUpdate(
            { _id: cartproducts[i].product_id._id },
            {
              $set: {
                stock:
                  cartproducts[i].product_id.stock - cartproducts[i].quantity,
              },
            }
          );
        }
  
        await User.findByIdAndUpdate(
          { _id: req.session.userId },
          { $set: { wallet: user.wallet - total } }
        );
  
        await Cart.deleteMany({ user_id: req.session.userId });
        req.flash("message", "Order Success!! Order placed using Wallet");
        res.redirect("/orderspage");
      } else {
        console.log("not enough money in wallet");
        req.flash("message", "Order Failed!! Not Enough Money in Wallet");
        res.redirect("/wallet");
      }
    }
  };
  
  // order placing via razorpay
  
  const razorpayorder = async (req, res) => {
    try {
      let amount = 0;
      const cartproducts = await Cart.find({
        user_id: req.session.userId,
      }).populate("product_id");
      for (let i = 0; i < cartproducts.length; i++) {
        if (cartproducts[i].product_id.offerprice == 0) {
          amount +=
            cartproducts[i].quantity * cartproducts[i].product_id.price * 100;
        } else {
          amount +=
            cartproducts[i].quantity *
            cartproducts[i].product_id.offerprice *
            100;
        }
      }
  
      const coupon = await Coupon.find({ code: req.body.couponcode });
  
      let discount;
      if (coupon.length == 0) {
        discount = 0;
      } else {
        discount = Number(coupon[0].discount_price) * 100;
      }
  
      const options = {
        amount: amount,
        currency: "INR",
        receipt: "razorUser@gmail.com",
      };
  
      razorpayInstance.orders.create(options, (err, order) => {
        if (!err) {
          res.status(200).send({
            success: true,
            msg: "Order Created",
  
            amount: amount - discount,
            key_id: RAZORPAY_ID_KEY,
            product_name: "req.body.name",
            description: "req.body.description",
            contact: "9745127684",
            name: "Mohamed Nizar",
            email: "nizarp666@gmail.com",
          });
        } else {
          res.status(400).send({ success: false, msg: "Something went wrong!" });
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  // save order function
  
  const saveorder = async (req, res) => {
    try {
      const cartproducts = await Cart.find({
        user_id: req.session.userId,
      }).populate("product_id");
  
      let carttotalamount = 0;
      for (let i = 0; i < cartproducts.length; i++) {
        if (cartproducts[i].product_id.offerprice == 0) {
          carttotalamount +=
            cartproducts[i].quantity * cartproducts[i].product_id.price;
          const order = new Order({
            user_id: req.session.userId,
            product_id: cartproducts[i].product_id._id,
            address_id: req.body.addressid,
            quantity: cartproducts[i].quantity,
            total: cartproducts[i].quantity * cartproducts[i].product_id.price,
            order_date: new Date().toLocaleDateString(),
            payment_method: "RazorPay",
            coupon_code: req.body.couponcode,
            status: "Pending",
            return_reason: "",
            delivery_date: "",
          });
          await order.save();
        } else {
          carttotalamount +=
            cartproducts[i].quantity * cartproducts[i].product_id.offerprice;
          const order = new Order({
            user_id: req.session.userId,
            product_id: cartproducts[i].product_id._id,
            address_id: req.body.addressid,
            quantity: cartproducts[i].quantity,
            total:
              cartproducts[i].quantity * cartproducts[i].product_id.offerprice,
            order_date: new Date().toLocaleDateString(),
            payment_method: "RazorPay",
            coupon_code: req.body.couponcode,
            status: "Pending",
            return_reason: "",
            delivery_date: "",
          });
          await order.save();
        }
  
        await Product.findByIdAndUpdate(
          { _id: cartproducts[i].product_id._id },
          {
            $set: {
              stock: cartproducts[i].product_id.stock - cartproducts[i].quantity,
            },
          }
        );
      }
  
      await Cart.deleteMany({ user_id: req.session.userId });
      res.json({ success: true, message: "Order saved successfully." });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Failed to save the order." });
    }
  
    const ordersbyrazorpay = await Order.find({
      user_id: req.session.userId,
      payment_method: "RazorPay",
    });
    const user = await User.findById({ _id: req.session.userId });
  
    let referalcode = user.name + "Referal123";
  
    if (ordersbyrazorpay.length >= 5) {
      await User.findByIdAndUpdate(
        { _id: req.session.userId },
        { $set: { referal_code: referalcode } }
      );
    }
  };
  
  // enter to order details page
  
  const orderdetails = async (req, res) => {
    try {
      const orderid = req.query.id;
      const order = await Order.findById({ _id: orderid })
        .populate("product_id")
        .populate("address_id");
      res.render("orderdetails", { model: "1", order: order });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  // order cancelling
  
  const cancelorder = async (req, res) => {
    try {
      const orderid = req.query.id;
  
      const order = await Order.findById({ _id: orderid }).populate("product_id");
      await Order.findByIdAndUpdate(
        { _id: orderid },
        { $set: { status: "Cancelled" } }
      );
      await Product.findByIdAndUpdate(
        { _id: order.product_id._id },
        {
          $set: {
            stock: order.product_id.stock + order.quantity,
          },
        }
      );
      if (
        order.payment_method == "Wallet" ||
        order.payment_method == "RazorPay"
      ) {
        const thisorder = await Order.findById({ _id: orderid });
  
        const user = await User.find({ _id: thisorder.user_id });
  
        userwallet = Number(user[0].wallet) + Number(order.total);
  
        await User.findByIdAndUpdate(
          { _id: thisorder.user_id },
          { $set: { wallet: userwallet } }
        );
      }
      res.send({ message: "Cancelled successfully" });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  //enter returning the order page
  
  const returnorderpage = async (req, res) => {
    try {
      const orderid = req.query.id;
  
      const orders = await Order.find({ _id: orderid })
        .populate("product_id")
        .exec();
  
      res.render("returnreason", { model: "1", orders: orders });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  // returning the order
  
  const returnorder = async (req, res) => {
    try {
      const orderid = req.query.id;
  
      const order = await Order.findById({ _id: orderid }).populate("product_id");
      await Order.findByIdAndUpdate(
        { _id: orderid },
        { $set: { status: "Request Pending" } }
      );
  
      const returns = new Return({
        order_id: orderid,
        reason: req.query.reason,
        return_date: new Date().toLocaleDateString(),
      });
      await returns.save();
  
      await Product.findByIdAndUpdate(
        { _id: order.product_id._id },
        {
          $set: {
            stock: order.product_id.stock + order.quantity,
          },
        }
      );
      res.send({ message: "Order is returning" });
    } catch (error) {
      console.log(error.message);
    }
  };


  // ================ADMIN-SIDE===============================

  const ordermgmtpage = async (req, res) => {
    try {
      const orders = await Order.find()
        .populate("user_id")
        .populate("product_id")
        .populate("address_id");
      res.render("ordermgmt", { orders: orders });
    } catch (error) {
      console.log(error.message);
    }
  };

  
const updatestatus = async (req, res) => {
  try {
    const id = req.query.id;
    await Order.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          status: req.body.status,
        },
      }
    );
    const order = await Order.findById({ _id: id });

    if (order.status == "Delivered") {
      await Order.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            delivery_date: new Date(),
          },
        }
      );
    }

    const orderdate = await Order.findById({ _id: id });

    const orders = await Order.find()
      .populate("user_id")
      .populate("product_id")
      .populate("address_id");
    res.render("ordermgmt", { orders: orders });
  } catch (error) {
    console.log(error.message);
  }
};

const returndetailspage = async (req, res) => {
  const allreturns = await Return.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "order_id",
        foreignField: "_id",
        as: "order",
      },
    },
    {
      $unwind: "$order",
    },
    {
      $lookup: {
        from: "products",
        localField: "order.product_id",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $lookup: {
        from: "users",
        localField: "order.user_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
  ]);

  res.render("returndetailspage", { allreturns: allreturns });
};

const returnsreasonspage = async (req, res) => {
  const returnid = req.query.id;
  const returns = await Return.find({ _id: returnid });

  res.render("returnreasonspage", { returns: returns });
};

const returnapprove = async (req, res) => {
  try {
    const returnid = req.query.id;
    await Order.findByIdAndUpdate(
      { _id: returnid },
      { $set: { status: "Returned" } }
    );

    await Return.deleteOne({ order_id: returnid });

    const data = new Returned({
      order_id: returnid,
      returned_date: new Date().toLocaleDateString(),
    });

    await data.save();

    const order = await Order.findById({ _id: returnid });

    const user = await User.find({ _id: order.user_id });

    userwallet = Number(user[0].wallet) + Number(order.total);

    await User.findByIdAndUpdate(
      { _id: order.user_id },
      { $set: { wallet: userwallet } }
    );

    res.send({ message: "Order returned successfully" });
  } catch (error) {
    console.log(error.message);
  }
};



  module.exports={
    checkoutpage,
    orderspage,
  order,
  razorpayorder,
  saveorder,
  orderdetails,
  cancelorder,
  returnorderpage,
  returnorder,
  ordermgmtpage,
  updatestatus,
  returndetailspage,
  returnsreasonspage,
  returnapprove,
  }
