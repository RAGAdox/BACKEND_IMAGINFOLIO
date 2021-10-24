const express = require("express");
const formidableMiddleware = require("express-formidable");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const { isSignedIn, isAuthorized } = require("../controllers/auth");
const { uploadFile, uploadFileKafka } = require("../middleware/fileUpload");
const {
  getUserByUsername,
  parseForm,
  createPost,
  getUserFeed,
  getPostId,
  likePost,
  commentPost,
} = require("../controllers/user");
router.param("username", getUserByUsername);
router.param("postId", getPostId);
router.get("/get-feed/:username", isSignedIn, isAuthorized, getUserFeed);
router.get("/profile/:username", isSignedIn, isAuthorized, (req, res) => {
  return res.json(req.user);
});
router.post(
  "/create-post/:username",
  isSignedIn,
  isAuthorized,
  parseForm,
  uploadFileKafka,
  createPost
);
router.get("/likePost/:username/:postId", isSignedIn, isAuthorized, likePost);
router.post(
  "/commentPost/:username/:postId",
  isSignedIn,
  isAuthorized,
  commentPost
);
module.exports = router;
