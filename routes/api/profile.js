const express = require("express");
const router = express.Router();

//@route     GET api/profile/login
//@desc      test profile route
//@access    PUBLIC
router.get("/login", (req, res) => res.json({ msg: "Profile works" }));

module.exports = router;
