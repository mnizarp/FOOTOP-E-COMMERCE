
const Cart = require("../models/cartModel");
const Wishlist = require("../models/wishlistModel");

// opening the cart

const opencart = async (req, res) => {
    const userId = req.session.userId;
  
    if (userId) {
      const cartproducts = await Cart.find({ user_id: userId }).populate(
        "product_id"
      );
  
      res.render("cart", { model: "1", cartproducts: cartproducts });
    } else {
      res.redirect("/login");
    }
  };
  
  // add product to cart
  
  const addtocart = async (req, res) => {
    try {
      const productid = req.query.id;
      const userId = req.session.userId;
      const productincart = await Cart.find({
        product_id: productid,
        user_id: userId,
      }).populate("product_id");
  
      if (userId) {
        if (productincart.length == 0) {
          const data = new Cart({
            user_id: req.session.userId,
            product_id: productid,
            quantity: 1,
          });
          await data.save();
  
          const wishlist = await Wishlist.find({ product_id: productid });
          if (wishlist.length > 0) {
            await Wishlist.deleteOne({ product_id: productid });
          }
  
          res.send({
            message:"0",
            success: true,
            msg: "product added to cart",
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
  
  // remove product from cart
  
  const removefromcart = async (req, res) => {
    try {
      const cartproductid = req.query.id;
  
      await Cart.findByIdAndDelete({ _id: cartproductid });
      res.send({ message: "Item deleted successfully" });
      // res.redirect("/opencart");
    } catch (error) {
      console.log(error.message);
    }
  };
  
  // increasing the no.of quantity
  
  const qtyplus = async (req, res) => {
    const cartid = req.query.id;
    const cart = await Cart.findById(cartid);
    if (cart) {
      const newQty = cart.quantity + 1;
      cart.quantity = newQty;
      await cart.save();
      res.send("Quantity updated successfully.");
    } else {
      res.status(404).send("Cart item not found.");
    }
  };
  
  // decreasing the no.of quantity
  
  const qtyminus = async (req, res) => {
    const cartid = req.query.id;
    const cart = await Cart.findById(cartid);
    if (cart) {
      const newQty = cart.quantity - 1;
      if (newQty >= 1) {
        cart.quantity = newQty;
        await cart.save();
        res.send("Quantity updated successfully.");
      } else {
        res.send("Quantity cannot be less than 1.");
      }
    } else {
      res.status(404).send("Cart item not found.");
    }
  };

  module.exports={
    opencart,
    addtocart,
    removefromcart,
    qtyplus,
    qtyminus
  }