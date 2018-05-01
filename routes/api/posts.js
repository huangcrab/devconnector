const express = require("express");
const router = express.Router();

//@route     GET api/posts/login
//@desc      test posts route
//@access    PUBLIC

router.get("/login", (req, res) => res.json({ msg: "Posts works" }));

module.exports = router;
