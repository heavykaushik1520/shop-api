const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//............................................REGISTER
// router.post("/register", async (req, res)=>
// {
//     const newUser = ({
//         username : req.body.username ,
//         email : req.body.email,
//         // password : CryptoJS.AES.encrypt(
//         //     req.body.password ,
//         //     process.env.PASS_SEC
//         // ).toString(),
//         password : req.body.password
//     })

//     try {

//         const savedUser = await newUser.save();
//         res.status(201).json(
//             savedUser
//         )

//     } catch (error) {

//         res.status(500).json({
//             success : false ,
//             message : error.message
//         })

//     }
// })

//log in
router.post("/register", async (req, res) => {
  try {
    // Create an instance of User model
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString(),
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Respond with the saved user
    res.status(201).json(savedUser);
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    });

    !user && res.status(401).json("Wrong user name");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );

    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    console.log(originalPassword);

    const inputPassword = req.body.password;

    originalPassword != inputPassword && res.status(401).json("Wrong Password");

    // JWT IMPLEMENTATION .................................
    const accessToken = jwt.sign(
      //sign takes 3 values
      {
        id: user._id, //1st value i e payload data
        isAdmin: user.isAdmin,
      },

      process.env.JWT_SEC, //2nd secret key

      { expiresIn: "60" } // 3rd expire date
    );

    const { password, ...others } = user._doc; //extract data without including password
    res.status(200).json({ ...others, accessToken }); //code constructs a response JSON object
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
