const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");
//load profile model
const Profile = require("../../models/Profile");
const User = require("../../models/User");

//@route     GET api/profile/
//@desc      get current users profile
//@access    PRIVATE
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errs = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
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
//@route     GET api/profile/all
//@desc      get all profiles
//@access    PUBLIC
router.get("/all", (req, res) => {
  const errs = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errs.noprofile = "There are no erros";
        return res.status(404).json(errs);
      }

      res.json(profiles);
    })
    .catch(err => {
      res.status(404).json({ profile: "There are no profiles" });
    });
});
//@route     GET api/profile/handle/:handle
//@desc      get users profile by handle
//@access    PUBLIC
router.get("/handle/:handle", (req, res) => {
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errs.noprofile = "There is no profile for this user";
        res.status(404).json(errs);
      }

      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: "There is no profile for this user" })
    );
});

//@route     GET api/profile/user/:user_id
//@desc      get users profile by handle
//@access    PUBLIC
router.get("/user/:user_id", (req, res) => {
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errs.noprofile = "There is no profile for this user";
        res.status(404).json(errs);
      }

      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: "There is no profile for this user" })
    );
});

//@route     POST api/profile/
//@desc      create or updat users profile
//@access    PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errs, isValid } = validateProfileInput(req.body);

    if (!isValid) {
      //return errs with 400
      return res.status(400).json(errs);
    }

    //get fields
    const profileFields = {};
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
        Profile.findOne({ handle: profileFields.handle })
          .then(profile => {
            if (profile) {
              errs.handle = "The Handle already exists";
              res.status(400).json(errs);
            }

            //save profile
            new Profile(profileFields)
              .save()
              .then(profile => res.json(profile));
          })
          .catch(err => res.status(400).json(err));
      }
    });
  }
);
//@route     POST api/experience/
//@desc      add or update experience
//@access    PRIVATE
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errs, isValid } = validateExperienceInput(req.body);

    if (!isValid) {
      //return errs with 400
      return res.status(400).json(errs);
    }

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const newExp = {
          title: req.body.title,
          company: req.body.company,
          location: req.body.location,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        };

        //add to exp array
        profile.experience.unshift(newExp);
        profile
          .save()
          .then(profile => res.json(profile))
          .catch(err => res.json(err));
      })
      .catch(err => res.json(err));
  }
);

//@route     POST api/experience/
//@desc      add or update experience
//@access    PRIVATE
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errs, isValid } = validateEducationInput(req.body);

    if (!isValid) {
      //return errs with 400
      return res.status(400).json(errs);
    }

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const newEdu = {
          school: req.body.school,
          degree: req.body.degree,
          major: req.body.major,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        };

        //add to exp array
        profile.education.unshift(newEdu);
        profile
          .save()
          .then(profile => res.json(profile))
          .catch(err => res.status(400).json(err));
      })
      .catch(err => res.status(400).json(err));
  }
);

//@route     DELETE api/experience/:exp_id
//@desc      Delete experience
//@access    PRIVATE
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);
        profile
          .save()
          .then(profile => res.json(profile))
          .catch(err => res.status(400).json(err));
      })
      .catch(err => res.json(err));
  }
);

//@route     DELETE api/education/:edu_id
//@desc      Delete education
//@access    PRIVATE
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);
        profile.education.splice(removeIndex, 1);
        profile
          .save()
          .then(profile => res.json(profile))
          .catch(err => res.status(400).json(err));
      })
      .catch(err => res.json(err));
  }
);

//@route     DELETE api/profile/
//@desc      Delete user and profile
//@access    PRIVATE
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

module.exports = router;
