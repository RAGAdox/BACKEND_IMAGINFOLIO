const bcrypt = require("bcrypt");
const jsonWebToken = require("jsonwebtoken");
const jwt = require("express-jwt");
const { saveUser } = require("../db/saveData");
const { getCredentials } = require("../db/fetchData");
const { validationCheck } = require("../utils/validations");
exports.createUser = async (req, res) => {
  const { username, password, email, fullname } = req.body;
  if (validationCheck(req, res)) {
    const hashString = bcrypt.hashSync(password, 10);
    const result = await saveUser(username, hashString, email, fullname);
    if (result.error)
      return res.status(422).json({
        success: false,
        message: result.error,
        debug: result.debug.detail,
      });
    return res.json({ success: true, message: "User successfully created" });
  }
};
exports.signIn = async (req, res) => {
  if (validationCheck(req, res)) {
    const { username, password } = req.body;
    const result = await getCredentials(username);
    if (result.length !== 0) {
      const match = await bcrypt.compare(password, result[0].password_hash);
      if (match === true) {
        const token = jsonWebToken.sign(
          { username: username },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRES,
          }
        );
        return res.json({
          success: true,
          token: token,
          message: "Correct Credentials Provided",
        });
      }
    }
    return res
      .status(401)
      .json({ success: false, message: "Invalid Credentials" });
  }
};

exports.isSignedIn = [
  jwt({
    secret: process.env.JWT_SECRET,
    credentialsRequired: true,
    userProperty: "auth",
    algorithms: ["HS256"],
  }),
  (err, req, res, next) => {
    if (err) {
      return res.status(err.status).json(err);
    }
    next();
  },
];
exports.isAuthorized = (req, res, next) => {
  if (req.user && req.auth && req.user.username === req.auth.username) {
    return next();
  }
  return res
    .status(403)
    .json({ success: false, error: "Not Allowed to access this resource" });
};
