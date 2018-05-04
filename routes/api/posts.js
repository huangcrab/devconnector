const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Post = require("../../models/Post");
const validatePostInput = require("../../validation/post");

const validateCommentInput = require("../../validation/comment");

const Profile = require("../../models/Profile");
//@route     GET api/posts/login
//@desc      test posts route
//@access    PUBLIC

router.get("/login", (req, res) => res.json({ msg: "Posts works" }));

//@route     POST api/posts/like/:id
//@desc      like post
//@access    PRIVATE
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        if (post.dislikes.some(e => e.user.toString() === req.user.id)) {
          const index = post.dislikes
            .map(item => item.user)
            .indexOf(req.user.id);
          post.dislikes.splice(index, 1);
          post.likes.unshift({ user: req.user.id });
        }
        //post.likes.filter(like => like.user.toString() === req.user.id).length > 0
        else if (post.likes.some(e => e.user.toString() === req.user.id)) {
          const index = post.likes.map(item => item.user).indexOf(req.user.id);
          post.likes.splice(index, 1);
        } else {
          post.likes.unshift({ user: req.user.id });
        }
        post.save().then(post => res.json(post));
      })
      .catch(err => res.json({ notfound: "Post not found" }));
  }
);

//@route     POST api/posts/like/:id
//@desc      like post
//@access    PRIVATE
router.post(
  "/dislike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        //post.likes.filter(like => like.user.toString() === req.user.id).length > 0
        if (post.likes.some(e => e.user.toString() === req.user.id)) {
          const index = post.likes.map(item => item.user).indexOf(req.user.id);
          post.likes.splice(index, 1);
          post.dislikes.unshift({ user: req.user.id });
        } else if (post.dislikes.some(e => e.user.toString() === req.user.id)) {
          const index = post.dislikes
            .map(item => item.user)
            .indexOf(req.user.id);
          post.dislikes.splice(index, 1);
        } else {
          post.dislikes.unshift({ user: req.user.id });
        }
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ notfound: "Post not found" }));
  }
);

//@route     POST api/posts/comment/:id
//@desc      create comment
//@access    PRIVATE
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errs, isValid } = validateCommentInput(req.body);

    if (!isValid) {
      res.status(400).json(errs);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          user: req.user.id,
          avatar: req.user.avatar,
          text: req.body.text,
          name: req.body.name
        };
        post.comments.unshift(newComment);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ notfound: "Post not found" }));
  }
);

//@route     DELETE api/posts/comment/:id
//@desc      delete comment
//@access    PRIVATE
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        const result = post.comments.filter(
          e =>
            e._id.toString() === req.params.comment_id &&
            e.user.toString() === req.user.id
        );
        if (result.length > 0) {
          const index = post.comments
            .map(item => item._id)
            .indexOf(req.params.comment_id);
          post.comments.splice(index, 1);
        } else {
          return res.status(404).json({ notfound: "No comment found" });
        }

        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ notfound: "Post not found" }));
  }
);

//@route     POST api/posts/
//@desc      create post
//@access    PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errs, isValid } = validatePostInput(req.body);

    if (!isValid) {
      //return errs with 400
      return res.status(400).json(errs);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

//@route     GET api/posts/all
//@desc      get all posts by user id
//@access    PUBLIC
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.json({ nopostfound: "No posts found" }));
});

//@route     GET api/posts/:id
//@desc      get post by id
//@access    PUBLIC
router.get("/:id", (req, res) => {
  Post.findOne({ _id: req.params.id })
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: "No post found for this id" })
    );
});

//@route     Delete api/posts/:post_id
//@desc      delete post
//@access    PRIVATE
router.delete(
  "/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findOne({ _id: req.params.post_id })
      .then(post => {
        if (req.user.id === post.user.toString()) {
          post
            .remove()
            .then(() => res.json({ success: true }))
            .catch(err => res.json({ postnotfound: "Post not found" }));
        } else {
          return res.status(401).json({ notauthorized: "Not Authorizied" });
        }
      })
      .catch(err =>
        res.status(404).json({ nopostfound: "No post found for this id" })
      );
  }
);

module.exports = router;
