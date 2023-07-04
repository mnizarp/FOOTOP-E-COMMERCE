const User = require("../models/userModel");
const Product = require("../models/productModel");
const Otp = require("../models/otpModel");
const otpGenerator = require("otp-generator");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Returned = require("../models/returnedModel");
const { validationResult } = require("express-validator");
// const emailValidator = require("deep-email-validator");
const nodemailer = require("nodemailer");



// ----------------USER-SIDE------------------------------------------


//Otp login email enter page

const otplogin = (req, res) => {
  res.render("otpemailpage");
};

//Otp email sending

const otpemailsubmit = async (req, res) => {
  try {
    const userData = await User.findOne({ email: req.body.email });
    if (userData) {
      if (userData.block == false) {
        const OTP = otpGenerator.generate(4, {
          digits: true,
          alphabets: false,
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false,
        });
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "nizarp666@gmail.com",
            pass: process.env.EMAIL_PASS,
          },
        });
        var mailOptions = {
          from: "nizarp666@gmail.com",
          to: userData.email,
          subject: "OTP VERIFICATION",
          text: "PLEASE ENTER THE OTP FOR LOGIN " + OTP,
        };
        transporter.sendMail(mailOptions, function (error, info) {});
        const otps = await Otp.findOne({ email: req.body.email });
        if (!otps) {
          const otp = new Otp({ email: req.body.email, otp: OTP });
          await otp.save();
        } else {
          await Otp.updateOne(
            { email: req.body.email },
            { $set: { otp: OTP } }
          );
        }
        res.render("otpenterpage", { userdata: userData });
      }
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};

//Otp submitting

const otpsubmit = async (req, res) => {
  try {
    const useremail = req.body.email;
    const userotp = req.body.otp;

    const otpHolder = await Otp.findOne({ email: useremail });

    if (otpHolder.otp == userotp) {
      // res.render("home", { model: "1" });
      const check = await User.findOne({ email: useremail });

      if (check.block === false) {
        req.session.userId = check._id;
        res.redirect("/");
      } else {
        res.redirect("/login");
      }
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: "Server Error" });
  }
};

// homepage enter

const homepage = async (req, res) => {
  try {
    const userId = req.session.userId;
    const products = await Product.find({ isDeleted: false }).populate(
      "category_id"
    );
    const offerproducts = [];
    if(products.length>0){
    
    products.forEach((product) => {
      if (product.offerprice > 0) {
        offerproducts.push(product);
      }
    });
  }
    if (userId) {
      res.render("home", { model: "1", products: offerproducts });
    } else {
      res.render("home", { model: "0", products: offerproducts });
    }
  
  } catch (error) {
    console.log(error.message);
  }
};

// Enter login page

const loginpage = (req, res) => {
  try {
    if (req.session.userId) {
      res.redirect("/");
    } else {
      res.render("login", { incorrect: "" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// Enter signup page

const signuppage = (req, res) => {
  try {
    if (req.session.userId) {
      res.redirect("/");
    } else {
      res.render("signup", { errors: "", notice: "" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//back button to go back to login page

const backtologinpage = (req, res) => {
  res.redirect("/login");
};



// add new user

const add_newuser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("signup", { errors: errors.array(), notice: "" });
  }
  // async function isEmailValid(email) {
  //   return emailValidator.validate(email);
  // }
  const { name, email, phone, password } = req.body;
  const user = new User({
    name,
    email,
    phone,
    password,
    isadmin: 0,
    wallet: 0,
    referal_code: "",
    reg_date: new Date().toLocaleDateString(),
  });

  

  // const { valid, reason, validators } = await isEmailValid(req.body.email);

  // if (valid) {


  const checking = await User.findOne({ email: req.body.email });
  if (checking) {
    res.render("signup", { notice: "Email already registered", errors: "" });
  } else {
    if (req.body.password == req.body.confirmpassword) {
      const new_user = await user.save();
      

      sendVerifyMail(req.body.name, req.body.email, new_user._id);
      res.render('verificationloading')
    } else {
      res.render("signup", {
        notice: "Password confirmation failed",
        errors: "",
      });
    }
  }
  // } else {
  //   res.render("signup", { notice: "Email verification falied", errors: "" });
  // }
};

const sendVerifyMail = async (name, email, user_id) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "nizarp666@gmail.com",
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "nizarp666@gmail.com",
      to: email,
      subject: "For Email Verification",
      html:
        "<p>Hii " +
        name +
        ',please click here to <a href="http://footopft.shop/verify?id=' +
        user_id +
        '"> verify </a> your mail.</p> ',
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent:- ", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const verifyMail = async (req, res) => {
  try {
    await User.updateOne({ _id: req.query.id }, { $set: { isVerified: true } });
    const user = await User.findById({ _id: req.query.id });
    res.render("referalcodeenterpage", { user: user, notfound: "" });
  } catch (error) {
    console.log(error.message);
  }
};

const referalapply = async (req, res) => {
  const user = await User.findById({ _id: req.query.id });

  const referreduser = await User.find({ referal_code: req.body.referalcode });

  if (referreduser.length > 0) {
    await User.findByIdAndUpdate(
      { _id: referreduser[0]._id },
      { $set: { wallet: referreduser[0].wallet + 100 } }
    );
    await User.findByIdAndUpdate(
      { _id: user._id },
      { $set: { wallet: user.wallet + 100 } }
    );
    req.session.userId = req.query.id;
    res.redirect("/");
  } else {
    res.render("referalcodeenterpage", {
      user: user,
      notfound: "Invalid Referal code",
    });
  }
};

const skipreferal = async (req, res) => {
  req.session.userId = req.body.userid;
  res.redirect("/");
};

// user login

const userlogin = async (req, res) => {
  try {
    const check = await User.findOne({ email: req.body.email });
    if (check) {
      if (
        check.password === req.body.password &&
        check.block === false &&
        check.isVerified == true
      ) {
        req.session.userId = check._id;
        res.redirect("/");
      } else {
        res.render("login", { incorrect: "Incorrect Password" });
      }
    } else {
      res.render("login", { incorrect: "Incorrect Email" });
    }
  } catch {
    res.send("wrong details");
  }
};

// logout

const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};





// entering to profle page

const profilepage = async (req, res) => {
  try {
    const userid = req.session.userId;
    const userdetails = await User.findById({ _id: userid });
    res.render("profile", { model: "1", userdetails: userdetails });
  } catch (error) {
    console.log(error.message);
  }
};

// enter to edit profile page

const editprofilepage = async (req, res) => {
  const userid = req.session.userId;
  const userdetails = await User.findById({ _id: userid });
  res.render("editprofilepage", {
    model: "1",
    userdetails: userdetails,
    errors: "",
  });
};

// editing the profile

const profileedit = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const userid = req.session.userId;
      const userdetails = await User.findById({ _id: userid });
      return res.render("editprofilepage", {
        errors: errors.array(),
        model: "1",
        userdetails: userdetails,
      });
    }
    const userid = req.session.userId;
    await User.findByIdAndUpdate(
      { _id: userid },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
        },
      }
    );
    res.redirect("/profilepage");
  } catch (error) {
    console.log(error.message);
  }
};

// entering to password changing page

const changepasswordpage = async (req, res) => {
  res.render("changepasswordpage", { model: "1", notice: "", errors: "" });
};

// changing password

const changepassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("changepasswordpage", {
        errors: errors.array(),
        notice: "",
        model: "1",
      });
    }

    const userid = req.session.userId;
    const user = await User.find({
      _id: userid,
      email: req.body.email,
      password: req.body.currentpassword,
    });
    if (user.length != 0) {
      if (req.body.newpassword == req.body.confirmpassword) {
        await User.findByIdAndUpdate(
          { _id: userid },
          {
            $set: {
              password: req.body.confirmpassword,
            },
          }
        );
        res.redirect("/profilepage");
      } else {
        res.render("changepasswordpage", {
          model: "1",
          notice: "Failed to confirm new Password",
          errors: "",
        });
      }
    } else {
      res.render("changepasswordpage", {
        model: "1",
        notice: "Invalid Email or Password",
        errors: "",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};



// checking coupon valid or not

const checkvalidcoupon = async (req, res) => {
  try {
    const couponCode = req.query.id;

    const coupon = await Coupon.findOne({ code: couponCode }).populate(
      "discount_category"
    );

    if (coupon) {
      const products = [];
      let total = 0;

      const offer = await Cart.find({ user_id: req.session.userId }).populate(
        "product_id"
      );
      for (let i = 0; i < offer.length; i++) {
        if (offer[i].product_id.offerprice == 0) {
          total += offer[i].quantity * offer[i].product_id.price;
        } else {
          total += offer[i].quantity * offer[i].product_id.offerprice;
        }

        products.push(offer[i].product_id.category_id);
      }

      var flag = 0;
      for (let i = 0; i < products.length; i++) {
        if (
          String(products[i]) == String(coupon.discount_category._id) &&
          offer[i].product_id.price >= coupon.min_purchase
        ) {
          flag = 1;
          break;
        }
      }

      if (flag == 1) {
        return res.json({ message: "1", coupon: coupon, total: total });
      }

      if (flag == 0) {
        for (let i = 0; i < products.length; i++) {
          if (
            String(products[i]) == String(coupon.discount_category._id) &&
            offer[i].product_id.price < coupon.min_purchase
          ) {
            flag = 2;
            break;
          }
        }
      }
      var category = 0;
      if (flag == 0) {
        for (let i = 0; i < products.length; i++) {
          if (String(products[i]) == String(coupon.discount_category._id)) {
            category = 1;
          }
        }
      }
      if (flag == 2) {
        return res.json({ message: "2", coupon: coupon });
      }
      if (category == 0) {
        res.json({ message: "3", coupon: coupon });
      }
    } else {
      res.send({ message: "Coupon code invalid" });
    }
  } catch (error) {
    console.log(error.message);
  }
};



// entering wallet page

const wallet = async (req, res) => {
  try {
    const returned_orders = [];
    const allreturned = await Returned.aggregate([
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
    ]);
    for (let i = 0; i < allreturned.length; i++) {
      if (allreturned[i].order.user_id == req.session.userId) {
        returned_orders.push(allreturned[i]);
      }
    }

    const user = await User.findById({ _id: req.session.userId });

    res.render("wallet", {
      model: "1",
      returns: returned_orders,
      user: user,
      message: req.flash("message"),
    });
  } catch (error) {
    console.log(error.message);
  }
};


// ----------------------ADMIN-SIDE-----------------------------

const usermgmtpage = async (req, res) => {
  try {
    const users = await User.find({ isadmin: 0 });
    res.render("usersmgmt", { users: users });
  } catch (error) {
    console.log(error.message);
  }
};

const blockuser = async (req, res) => {
  try {
    const id = req.query.id;

    const user = await User.findByIdAndUpdate(
      { _id: id },
      { $set: { block: true } }
    );
    if (user) {
      req.session.userId = "";
      res.send({ message: "User blocked successfully" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const unblockuser = async (req, res) => {
  try {
    const id = req.query.id;

    const userData = await User.findByIdAndUpdate(
      { _id: id },
      { $set: { block: false } }
    );

    if (userData) {
      req.session.userId = id;
      res.send({ message: "User  unblocked successfully" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  otplogin,
  otpemailsubmit,
  otpsubmit,
  homepage,
  loginpage,
  signuppage,
  backtologinpage,
  add_newuser,
  userlogin,
  logout,
  profilepage,
  editprofilepage,
  profileedit,
  changepasswordpage,
  changepassword,
  checkvalidcoupon,
  wallet,
  verifyMail,
  referalapply,
  skipreferal,
  usermgmtpage,
  blockuser,
  unblockuser,
};
