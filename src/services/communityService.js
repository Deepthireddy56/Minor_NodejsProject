const Community = require("../models/community");
const User = require("../models/user");

async function createCommunity(name, description, adminId) {
  const community = new Community({
    name,
    description,
    admin: adminId,
    members: [adminId] // Admin is automatically a member
  });

  return await community.save();
}

async function getCommunityById(communityId) {
  return Community.findById(communityId)
    .populate('admin', 'name email')
    .populate('members', 'name email');
}

async function addMemberToCommunity(communityId, userId) {
  const community = await Community.findById(communityId);
  if (!community) throw new Error("Community not found");

  if (community.members.includes(userId)) {
    throw new Error("User is already a member of this community");
  }

  community.members.push(userId);
  return await community.save();
}

async function getCommunitiesForUser(userId) {
  return Community.find({ 
    $or: [
      { admin: userId },
      { members: userId }
    ]
  }).populate('admin', 'name');
}

async function isCommunityAdmin(communityId, userId) {
  const community = await Community.findById(communityId);
  if (!community) throw new Error("Community not found");
  return community.admin.toString() === userId.toString();
}

async function isCommunityMember(communityId, userId) {
  const community = await Community.findById(communityId);
  if (!community) throw new Error("Community not found");
  return community.members.some(member => member.toString() === userId.toString());
}

module.exports = {
  createCommunity,
  getCommunityById,
  addMemberToCommunity,
  getCommunitiesForUser,
  isCommunityAdmin,
  isCommunityMember
};