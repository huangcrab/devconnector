const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  let errs = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (Validator.isEmpty(data.title)) {
    errs.title = "Job Title field is required";
  }

  if (Validator.isEmpty(data.company)) {
    errs.company = "Company field is required";
  }

  if (Validator.isEmpty(data.from)) {
    errs.from = "From data field is required";
  }

  return {
    errs,
    isValid: isEmpty(errs)
  };
};
