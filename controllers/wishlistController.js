
const Cart = require("../models/cartModel");
const Wishlist = require("../models/wishlistModel");


const openwishlist = async (req, res) => {
    try {
      const userId = req.session.userId;
  
      if (userId) {
        const wishlistproducts = await Wishlist.find({
          user_id: userId,
        }).populate("product_id");
  
        res.render("wishlist", {
          model: "1",
          wishlistproducts: wishlistproducts,
        });
      } else {
        res.redirect("/login");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const addtowishlist = async (req, res) => {
    try {
      const productid = req.query.id;
      const userId = req.session.userId;
      const productinwishlist = await Wishlist.find({
        product_id: productid,
        user_id: userId,
      }).populate("product_id");
  
      const productincart = await Cart.find({
        product_id: productid,
        user_id: userId,
      }).populate("product_id");
  
      if (userId) {
        if (productinwishlist.length == 0 && productincart.length == 0) {
          const data = new Wishlist({
            user_id: req.session.userId,
            product_id: productid,
          });
          await data.save();
  
          res.send({
            success: true,
            msg: "product added to wishlist",
            data: data,
          });
        } else {
          res.send({ message: "1" });
        }
      } else {
        res.redirect("/login");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const removefromwishlist = async (req, res) => {
    try {
      const wishlistproductid = req.query.id;
  
      await Wishlist.findByIdAndDelete({ _id: wishlistproductid });
      res.send({ message: "Item deleted successfully" });
    } catch (error) {
      console.log(error.message);
    }
  };

  module.exports={
    openwishlist,
  addtowishlist,
  removefromwishlist,
  }