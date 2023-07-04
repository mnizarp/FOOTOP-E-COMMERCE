const { body, validationResult } = require("express-validator");

const signupform=[
    body("name")
      .trim()
      .isLength({ min: 3, max: 15 })
      .withMessage("Name must have 3-15 letters")
      .isAlpha()
      .withMessage("Name should contain alphabets only"),
    body("email").trim().isEmail().withMessage("Please enter the email"),
    body("phone")
      .trim()
      .isLength({ min: 10, max: 10 })
      .withMessage("Please enter a valid phone number")
      .isInt({min:0})
      .withMessage("Phone number should contain numbers only"),
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Password must have 5 or more letters")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password must contain at least one special character"),
  ];

const profileedit=[
    body("name")
      .trim()
      .isLength({ min: 3, max: 15 })
      .withMessage("Name must have 3-15 letters")
      .isAlpha()
      .withMessage("Name should contain alphabets only"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter the correct email"),
    body("phone")
      .trim()
      .isLength({ min: 10, max: 10 })
      .withMessage("Please enter a valid phone number")
      .isInt({min:0})
      .withMessage("Phone number should contain numbers only"),
  ];

const changepassword=[
    body("newpassword")
      .trim()
      .isLength({ min: 5 })
      .withMessage("New Password must have 5 or more letters")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("New Password must contain at least one special character"),
  ];

const addressadd=[
    body("name")
      .trim()
      .isLength({ min: 3, max: 15 })
      .withMessage("Name must have 3-15 letters")
      .isAlpha()
      .withMessage("Name should contain alphabets only"),
    body("housename")
      .trim()
      .isLength({ min: 3, max: 15 })
      .withMessage("House name must have 3-15 letters")
      .isAlpha()
      .withMessage("House name should contain alphabets only"),
    body("district")
      .trim()
      .isLength({ min: 3, max: 15 })
      .withMessage("District must have 3-15 letters")
      .isAlpha()
      .withMessage("District should contain alphabets only"),
    body("state")
      .trim()
      .isLength({ min: 3, max: 15 })
      .withMessage("State must have 3-15 letters")
      .isAlpha()
      .withMessage("State should contain alphabets only"),
    body("country")
      .trim()
      .isLength({ min: 3, max: 15 })
      .withMessage("Country must have 3-15 letters")
      .isAlpha()
      .withMessage("Country should contain alphabets only"),
    body("phone")
      .trim()
      .isLength({ min: 10, max: 10 })
      .withMessage("Please enter a valid phone number")
      .isInt({min:0})
      .withMessage("Phone number should contain numbers only"),

    body("pincode")
      .trim()
      .isLength({ min: 6, max: 6 })
      .withMessage("Please enter a valid pin code")
      .isInt({min:0})
      .withMessage("Pin Code should contain numbers only"),
  ];

const editaddress=[
    body("name")
      .trim()
      .isLength({ min: 3, max: 15 })
      .withMessage("Name must have 3-15 letters")
      .isAlpha()
      .withMessage("Name should contain alphabets only"),
    body("housename")
      .trim()
      .isLength({ min: 3, max: 15 })
      .withMessage("House name must have 3-15 letters")
      .isAlpha()
      .withMessage("House name should contain alphabets only"),
    body("district")
      .trim()
      .isLength({ min: 3, max: 15 })
      .withMessage("District must have 3-15 letters")
      .isAlpha()
      .withMessage("District should contain alphabets only"),
    body("state")
      .trim()
      .isLength({ min: 3, max: 15 })
      .withMessage("State must have 3-15 letters")
      .isAlpha()
      .withMessage("State should contain alphabets only"),
    body("country")
      .trim()
      .isLength({ min: 3, max: 15 })
      .withMessage("Country must have 3-15 letters")
      .isAlpha()
      .withMessage("Country should contain alphabets only"),
    body("phone")
      .trim()
      .isLength({ min: 10, max: 10 })
      .withMessage("Please enter a valid phone number")
      .isInt({min:0})
      .withMessage("Phone number should contain numbers only"),

    body("pincode")
      .trim()
      .isLength({ min: 6, max: 6 })
      .withMessage("Please enter a valid pin code")
      .isInt({min:0})
      .withMessage("Pin Code should contain numbers only"),
  ]

  const categoryadd=[
    body("name")
      .trim()
      .isLength({ min: 3, max: 15 })
      .withMessage("Category Name must have 3-15 letters")
      .isAlpha()
      .withMessage("Category Name should contain alphabets only"),
   
  ];

  const couponadd=[
    body("code")
      .trim()
      .isLength({ min: 3, max: 7 })
      .not().matches(/[!@#$%^&*(),.?":{}|<> ]/)
      .withMessage("Coupon code must have 3-7 letters"),
    
    body("discount_price")
      .trim()
      .isInt({min:0})
      .withMessage("Please enter the discount price correctly"),

      body("min_purchase")
      .trim()
      .isInt({min:0})
      .withMessage("Please enter the min purchase price correctly"),
  ];

  const productadd=[
    body("name")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Name must have atleast 4 letters")
      .custom((value) => {
        const alphabeticLetters = value.match(/[a-zA-Z]/g) || [];
        return alphabeticLetters.length >= 4;
      })
      .withMessage('Name must contain at least 4 alphabetic letters'),

      body("description")
      .trim()
      .isLength({ min: 5})
      .withMessage("Description should contain atleast 5 alphabetic letters")
      .custom((value) => {
        const alphabeticLetters = value.match(/[a-zA-Z]/g) || [];
        return alphabeticLetters.length >= 5;
      })
      .withMessage('Description should contain atleast 5 alphabetic letters'),

    body("price")
      .trim()
      .isInt({min:0})
      .withMessage("Please enter price correctly"),

      body("stock")
      .trim()
      .isInt({min:0})
      .withMessage("Please enter stock correctly"),

  ];
  

  module.exports={
    signupform,
    profileedit,
    changepassword,
    addressadd,
    editaddress,
    categoryadd,
    couponadd,
    productadd
  }