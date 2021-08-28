const { check, validationResult } = require("express-validator");
exports.validationCheck = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      error: errors.array()[0].msg,
      params: errors.array()[0].param,
    });
    return false;
  }
  return true;
};
