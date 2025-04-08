const Post = require("../models/posts");
const User = require("../models/user");

async function createPost(content, authorId) {
  const author = await User.findById(authorId);
  if (!author) {
    throw new Error("User not found");
  }

  const newPost = new Post({ 
    content, 
    author: authorId,
    authorName: author.name, 
  });
  
  await newPost.save();
  
  return newPost;
}

async function getUserOwnPosts(userId) {
  return Post.find({ author: userId })
    .sort({ createdAt: -1 })

}

async function getFriendsPosts(userId) {
  const user = await User.findById(userId).select('following');
  if (!user) throw new Error("User not found");

  return Post.find({ author: { $in: user.following } })
    .sort({ createdAt: -1 });
}

module.exports = { createPost, getUserOwnPosts, getFriendsPosts };
