const express = require("express");
const router = express.Router();

//@route     GET api/users/login
//@desc      test users route
//@access    PUBLIC
router.get("/login", (req, res) => res.json({ msg: "Users works" }));

module.exports = router;
