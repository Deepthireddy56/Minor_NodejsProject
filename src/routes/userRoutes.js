const express = require("express");
const { sendFriendRequest, acceptFriendRequest } = require("../controllers/userController");
const authMiddleware = require("../utils/authMiddleware");

const router = express.Router();

router.get("/send-request/:friendId", authMiddleware, sendFriendRequest);
router.get("/accept-request/:friendId", authMiddleware, acceptFriendRequest);


module.exports = router;
