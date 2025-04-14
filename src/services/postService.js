const Post = require("../models/posts");
const User = require("../models/user");
const communityService = require("./communityService");

async function createPost(content, authorId, communityId = null) {
  const author = await User.findById(authorId);
  if (!author) throw new Error("User not found");

  let isCommunityPost = false;
  if (communityId) {
    isCommunityPost = true;
    const isAdmin = await communityService.isCommunityAdmin(communityId, authorId);
    if (!isAdmin) throw new Error("Only community admins can post in communities");
  }

  const newPost = new Post({ 
    content, 
    author: authorId,
    authorName: author.name,
    community: communityId,
    isCommunityPost
  });
  
  await newPost.save();
  return newPost;
}

async function getUserOwnPosts(userId) {
  return Post.find({ author: userId })
    .sort({ createdAt: -1 });
}

async function getFriendsPosts(userId) {
  const user = await User.findById(userId).select('following');
  if (!user) throw new Error("User not found");

  return Post.find({ 
    author: { $in: user.following },
    isCommunityPost: false // Only non-community posts from friends
  }).sort({ createdAt: -1 });
}

async function getCommunityPosts(communityId, userId) {
  const isMember = await communityService.isCommunityMember(communityId, userId);
  if (!isMember) throw new Error("You must be a member to view community posts");

  return Post.find({ community: communityId })
    .sort({ createdAt: -1 })
    .populate('author', 'name');
}

module.exports = { 
  createPost, 
  getUserOwnPosts, 
  getFriendsPosts,
  getCommunityPosts
};