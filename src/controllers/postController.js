const postService = require("../services/postService");

async function createPost(req, res) {
  try {
    const { content } = req.body;
    const post = await postService.createPost(content, req.userId);
    res.status(201).json({ 
      message: "Post created successfully", 
      post 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

module.exports = { 
  createPost, 
  getUserOwnPosts,
  getFriendsPosts
};