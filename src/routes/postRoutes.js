const express = require("express");
const { 
  createPost, 
  getUserOwnPosts,
  getFriendsPosts,
  getCommunityPosts
} = require("../controllers/postController");
const authMiddleware = require("../utils/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createPost);
router.get("/my-posts", authMiddleware, getUserOwnPosts);
router.get("/friends-posts", authMiddleware, getFriendsPosts);
router.get("/community/:communityId", authMiddleware, getCommunityPosts);

module.exports = router;