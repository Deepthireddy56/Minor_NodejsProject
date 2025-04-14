const express = require("express");
const { 
  createCommunity,
  getCommunityDetails,
  joinCommunity,
  getUserCommunities
} = require("../controllers/communityController");
const authMiddleware = require("../utils/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createCommunity);
router.get("/:communityId", authMiddleware, getCommunityDetails);
router.get("/:communityId/join", authMiddleware, joinCommunity);
router.get("/user/communities", authMiddleware, getUserCommunities);

module.exports = router;