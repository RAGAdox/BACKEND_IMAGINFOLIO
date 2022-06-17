const { check, validationResult } = require("express-validator");
const R = require("ramda");
exports.validationCheck = (req, res) => {
  const errors = validationResult(req).mapped();
  console.log(errors);
  if (!R.isEmpty(errors)) {
    res.status(422).json({
      success: false,
      errors,
      message: "Please provide correct information",
      //params: errors.array()[0].param,
    });
    return false;
  }
  return true;
};
