const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//load profile model
const Profile = require("../../models/Profile");
const User = require("../../models/User");

//@route     GET api/profile/login
//@desc      test profile route
//@access    PUBLIC
router.get("/login", (req, res) => res.json({ msg: "Profile works" }));

//@route     GET api/profile/
//@desc      get current users profile
//@access    PRIVATE
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errs = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errs.noprofile = "There is no profile for this user";
          return res.status(404).json(errs);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

//@route     POST api/profile/
//@desc      create or updat users profile
//@access    PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //get fields
    const profilelFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.website;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    //skills - split into array
    if (typeof req.body.skills !== "undefined")
      profileFields.skills = req.body.skills.split(",");

    //social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        //check if handle exist
        Profile.findOne({ handle: profilelFields.handle }).then(profile => {
          if (profile) {
            errs.handle = "The Handle already exists";
            res.status(400).json(errs);
          }

          //save profile
          new Profile(profilelFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

module.exports = router;
