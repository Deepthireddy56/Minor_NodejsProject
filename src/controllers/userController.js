const User = require("../models/user");

async function sendFriendRequest(req, res) {
  try {
    const { friendId } = req.params;
    const userId = req.userId;

    if (userId === friendId) {
      return res.status(400).json({ error: "You cannot send a request to yourself." });
    }

    const [user, friend] = await Promise.all([
      User.findById(userId),
      User.findById(friendId)
    ]);

    if (!user || !friend) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.friends.includes(friendId)) {
      return res.status(400).json({ error: "User is already your friend." });
    }

    if (friend.friendRequests.includes(userId)) {
      return res.status(400).json({ error: "Friend request already sent." });
    }

    if (friend.followers.includes(userId)) {
      return res.status(400).json({ error: "You are already following this user." });
    }

    friend.friendRequests.push(userId);
    await friend.save();

    res.json({ message: "Friend request sent successfully." });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}



async function acceptFriendRequest(req, res) {
  try {
    const { friendId } = req.params;
    const userId = req.userId;
    
    const [user, friend] = await Promise.all([
      User.findById(userId),
      User.findById(friendId)
    ]);

    if (!user || !friend) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.friendRequests.includes(friendId)) {
      return res.status(400).json({ error: "No friend request from this user" });
    }

    friend.following.push(userId);     
    user.followers.push(friendId);     

    user.friendRequests = user.friendRequests.filter(id => id.toString() !== friendId);

    await Promise.all([user.save(), friend.save()]);

    res.json({ 
      message: "Friend request accepted",
      friend: {
        _id: friend._id,
        name: friend.name
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


module.exports = { sendFriendRequest, acceptFriendRequest };