const express = require("express");
const { 
  createCommunity,
  getCommunityDetails,
  joinCommunity,
  getUserCommunities,
  removeMember,
  transferAdmin,
  addAdmin,
  removeAdmin
} = require("../controllers/communityController");
const authMiddleware = require("../utils/authMiddleware");
const communityAdminMiddleware = require("../utils/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createCommunity);
router.get("/:communityId", authMiddleware, getCommunityDetails);
router.get("/:communityId/join", authMiddleware, joinCommunity);
router.get("/user/communities", authMiddleware, getUserCommunities);
router.delete("/:communityId/members/:memberId", authMiddleware, removeMember);
router.patch("/:communityId/transfer-admin/:newAdminId", authMiddleware, transferAdmin);
router.post("/:communityId/admins/:userId", authMiddleware,communityAdminMiddleware, addAdmin);
router.delete("/:communityId/admins/:adminId", authMiddleware,communityAdminMiddleware, removeAdmin);

module.exports = router;