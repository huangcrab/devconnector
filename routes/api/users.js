const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const key = require("../../config/keys");
const passport = require("passport");

//load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
//@route     POST api/users/login
//@desc      Login users route / returning the token
//@access    PUBLIC
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const { errs, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errs);
  }
  //find user by email
  User.findOne({ email }).then(user => {
    if (!user) {
      errs.email = "User not found";
      return res.status(404).json(errs);
    }

    //check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //generate token

        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        }; //create jwt payload

        jwt.sign(payload, key.secret, { expiresIn: 3600 }, (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token
          });
        });
      } else {
        errs.password = "Password is not correct";
        return res.status(404).json(errs);
      }
    });
  });
});

//@route     GET api/users/register
//@desc      register users route
//@access    PUBLIC
router.post("/register", (req, res) => {
  const { errs, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errs);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errs.email = "Email already exist";
      return res.status(400).json(errs);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //size
        r: "pg", //rating
        d: "mm" //default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@route     GET api/users/current
//@desc      return current users route
//@access    PRIVATE
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;
