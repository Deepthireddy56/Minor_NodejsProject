const express = require("express");
const router = express.Router();
const {
  createSubGroup,
  addMember,
  removeMember,
  deleteSubGroup,
  joinSubGroup
} = require("../controllers/subGroupController");
const authMiddleware = require("../utils/authMiddleware");

router.post("/", authMiddleware, createSubGroup);
router.post("/:subGroupId/members/:userId", authMiddleware, addMember);
router.post("/:subGroupId/join", authMiddleware, joinSubGroup);
router.delete("/:subGroupId/members/:memberId", authMiddleware, removeMember);
router.delete("/:subGroupId", authMiddleware, deleteSubGroup);
module.exports = router;