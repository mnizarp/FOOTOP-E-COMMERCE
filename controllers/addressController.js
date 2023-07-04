
const Address = require("../models/addressModel");
const { validationResult } = require("express-validator");

// entering to address page

const addresspage = async (req, res) => {
    try {
      const userid = req.session.userId;
  
      const addresses = await Address.find({ user_id: userid });
  
      res.render("addresspage", { model: "1", addresses: addresses });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  // entering to address adding page
  
  const addnewaddress = async (req, res) => {
    res.render("addnewaddresspage", { model: "1", errors: "" });
  };
  
  // adding address
  
  const addressadd = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("addnewaddresspage", {
        errors: errors.array(),
        notice: "",
        model: "1",
      });
    }
  
    const address = new Address({
      user_id: req.session.userId,
      name: req.body.name,
      housename: req.body.housename,
      street: req.body.street,
      district: req.body.district,
      state: req.body.state,
      pincode: req.body.pincode,
      country: req.body.country,
      phone: req.body.phone,
    });
    await address.save();
    res.redirect("/addresspage");
  };
  
  // entering to address editing page
  
  const editaddresspage = async (req, res) => {
    try {
      const addressid = req.query.id;
      const address = await Address.findById({ _id: addressid });
      res.render("editaddresspage", { address: address, model: "1", errors: "" });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  // editing address
  
  const editaddress = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render("addnewaddresspage", {
          errors: errors.array(),
          notice: "",
          model: "1",
        });
      }
  
      const addressid = req.body.addressid;
      await Address.findByIdAndUpdate(
        { _id: addressid },
        {
          $set: {
            name: req.body.name,
            housename: req.body.housename,
            street: req.body.street,
            district: req.body.district,
            state: req.body.state,
            country: req.body.country,
            pincode: req.body.pincode,
            phone: req.body.phone,
          },
        }
      );
      res.redirect("/addresspage");
    } catch (error) {
      console.log(error.message);
    }
  };
  
  // deleting address
  
  const deleteaddress = async (req, res) => {
    try {
      const addressid = req.query.id;
      await Address.findByIdAndDelete({ _id: addressid });
      res.send({ message: "Address deleted successfully" });
    } catch (error) {
      console.log(error.message);
    }
  };

  

  module.exports={
    addresspage,
  addnewaddress,
  addressadd,
  editaddresspage,
  editaddress,
  deleteaddress,
  }