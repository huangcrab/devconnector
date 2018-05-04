const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  let errs = {};

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.major = !isEmpty(data.major) ? data.major : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (Validator.isEmpty(data.school)) {
    errs.school = "School field is required";
  }

  if (Validator.isEmpty(data.degree)) {
    errs.degree = "Degree field is required";
  }

  if (Validator.isEmpty(data.major)) {
    errs.major = "Major data field is required";
  }

  if (Validator.isEmpty(data.from)) {
    errs.from = "From date field is required";
  }

  return {
    errs,
    isValid: isEmpty(errs)
  };
};
