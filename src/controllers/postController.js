const postService = require("../services/postService");
async function createPost(req, res) {
  try {
    const { content, communityId } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: "Post content is required" });
    }
    
    if (communityId && typeof communityId !== 'string') {
      return res.status(400).json({ error: "Invalid communityId format" });
    }

    const post = await postService.createPost(
      content, 
      req.userId,                         // Ensure authMiddleware sets this
      communityId || null
    );
    
    res.status(201).json({ 
      message: "Post created successfully", 
      post 
    });
  } catch (err) {
    // More specific error handling
    if (err.message.includes("not found")) {
      return res.status(404).json({ error: err.message });
    }
    if (err.message.includes("Only community admins")) {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ 
      error: err.message,
      // Only show stack in development
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
}

async function getUserOwnPosts(req, res) {
  try {
    const posts = await postService.getUserOwnPosts(req.userId);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getFriendsPosts(req, res) {
  try {
    const posts = await postService.getFriendsPosts(req.userId);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getCommunityPosts(req, res) {
  try {
    const { communityId } = req.params;
    const posts = await postService.getCommunityPosts(communityId, req.userId);
    res.json(posts);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
}

async function deletePost(req, res) {
  try {
    const { postId } = req.params;
    const result = await postService.deletePost(postId, req.userId);
    res.json(result);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
}

module.exports = { 
  createPost, 
  getUserOwnPosts,
  getFriendsPosts,
  getCommunityPosts,
  deletePost
};