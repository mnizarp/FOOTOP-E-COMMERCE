const Product = require("../models/productModel");
const Offer = require("../models/offerModel");

const offermgmtpage = async (req, res) => {
    try {
      const products = await Product.find({ isDeleted: false, offerprice: 0 });
      const offers = await Offer.aggregate([
        {
          $lookup: {
            from: "products",
            localField: "product_id",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: "$product",
        },
        {
          $lookup: {
            from: "categories",
            localField: "product.category_id",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: "$category",
        },
        {
          $match: {
            "product.isDeleted": false, // Assuming "isDeleted" is the field indicating soft deletion
          },
        },
      ]);
  
      res.render("offermgmt", { products: products, offers: offers });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const createoffer = async (req, res) => {
    try {
      const productname = req.body.product;
  
      const percentage = req.body.percentage;
  
      const product = await Product.find({ name: productname });
  
      const offer = new Offer({
        product_id: product[0]._id,
        percentage: percentage,
      });
      await offer.save();
  
      const offerprice =
        product[0].price - Math.floor((product[0].price * percentage) / 100);
  
      await Product.updateOne(
        { name: productname },
        { $set: { offerprice: offerprice } }
      );
      res.redirect("/admin/offermgmtpage");
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const removeoffer = async (req, res) => {
    try {
      const id = req.query.id;
  
      const offer = await Offer.findById({ _id: id });
  
      await Product.findByIdAndUpdate(
        { _id: offer.product_id },
        { $set: { offerprice: 0 } }
      );
  
      await Offer.deleteOne({ _id: id });
  
      res.send({ message: "Offer removed successfully" });
    } catch (error) {
      console.log(error.message);
    }
  };

  module.exports={
    offermgmtpage,
  createoffer,
  removeoffer,
  }