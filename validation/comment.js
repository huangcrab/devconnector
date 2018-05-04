const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCommentInput(data) {
  let errs = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  if (!Validator.isLength(data.text, { min: 2, max: 100 })) {
    errs.text = "Text field length must be bwteen 2 to 100 characters";
  }
  if (Validator.isEmpty(data.text)) {
    errs.text = "Text field is required";
  }

  return {
    errs,
    isValid: isEmpty(errs)
  };
};
