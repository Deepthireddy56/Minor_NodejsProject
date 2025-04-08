const express = require("express");
const { 
  createPost, 
  getUserOwnPosts,
  getFriendsPosts
} = require("../controllers/postController");
const authMiddleware = require("../utils/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createPost);
router.get("/my-posts", authMiddleware, getUserOwnPosts);
router.get("/friends-posts", authMiddleware, getFriendsPosts);
module.exports = router;

