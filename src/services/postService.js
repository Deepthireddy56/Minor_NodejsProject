const Post = require("../models/posts");
const User = require("../models/user");
const Community = require("../models/community"); 
const communityService = require("./communityService");

async function createPost(content, authorId, communityId = null) {

  if (!content || !authorId) {
    throw new Error("Content and author ID are required");
  }

  const author = await User.findById(authorId);
  if (!author) throw new Error("User not found");

  let isCommunityPost = false;
  if (communityId) {
    isCommunityPost = true;
    
    const community = await Community.findById(communityId);
    if (!community) throw new Error("Community not found");

    const isAdmin = community.admins.some(adminId => 
      adminId && adminId.toString() === authorId.toString()
    );
    
    if (!isAdmin) {
      throw new Error("Only community admins can post in communities");
    }
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
    isCommunityPost: false 
  }).sort({ createdAt: -1 });
}

async function getCommunityPosts(communityId, userId) {
  if (!communityId || !userId) {
    throw new Error("Community ID and user ID are required");
  }

  const community = await Community.findById(communityId);
  if (!community) throw new Error("Community not found");

  const isMember = community.members.some(memberId =>
    memberId && memberId.toString() === userId.toString()
  );

  if (!isMember) throw new Error("You must be a member to view community posts");

  return Post.find({ community: communityId })
    .sort({ createdAt: -1 })
    .populate('author', 'name');
}

async function deletePost(postId, userId) {
  if (!postId || !userId) {
    throw new Error("Post ID and user ID are required");
  }

  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");

  const isAuthor = post.author.toString() === userId.toString();
  
  let isAdmin = false;
  if (post.community) {
    const community = await Community.findById(post.community);
    isAdmin = community.admins.some(adminId =>
      adminId.toString() === userId.toString()
    );
  }

  if (!isAuthor && !isAdmin) {
    throw new Error("Not authorized to delete this post");
  }

  await Post.findByIdAndDelete(postId);
  return { message: "Post deleted successfully" };
}
module.exports = { 
  createPost, 
  getUserOwnPosts, 
  getFriendsPosts,
  getCommunityPosts,
  deletePost
};