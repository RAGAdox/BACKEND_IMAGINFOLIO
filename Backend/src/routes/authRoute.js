const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const { createUser, signIn, isSignedIn } = require("../controllers/auth");
router.post(
  "/signup",
  [
    check("fullname", "Full Name is a required field")
      .isString()
      .not()
      .isEmpty(),
    check("username", "Username is a required field")
      .isString()
      .not()
      .isEmpty(),
    check("email", "Email is a required field").isString().not().isEmpty(),
    check("password", "Password is a required field")
      .isString()
      .not()
      .isEmpty(),
    check(
      "username",
      "username must be atleast 3 characters or at max 32 characters long"
    ).isLength({ max: 32, min: 3 }),
    check("email", "must provide a valid email address").isEmail(),
    check("password", "Password must be a strong password.")
      .isLength({
        min: 8,
      })
      .isStrongPassword(),
    check("fullname", "must provide full name").isString(),
  ],
  createUser
);
router.post(
  "/login",
  [check("username").isString(), check("password").isString()],
  signIn
);
router.get("/protected_route", isSignedIn, (req, res) => {
  return res.json({ success: true });
});
router.post("/checkPost", (req, res) => {
  console.log(req.body);
  return res.send("Hii");
});
module.exports = router;
