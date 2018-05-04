const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errs = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
    errs.text = "Text field length must be bwteen 10 to 300 characters";
  }
  if (Validator.isEmpty(data.text)) {
    errs.text = "Text field is required";
  }

  return {
    errs,
    isValid: isEmpty(errs)
  };
};
