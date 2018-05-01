const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errs = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!Validator.isEmail(data.email)) {
    errs.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.password)) {
    errs.password = "Password field is required";
  }

  if (Validator.isEmpty(data.email)) {
    errs.email = "Email field is required";
  }

  return {
    errs,
    isValid: isEmpty(errs)
  };
};
