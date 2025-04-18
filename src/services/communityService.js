const Community = require("../models/community");
const User = require("../models/user");
const subGroupService = require("./subGroupService");

async function createCommunity(name, description, creatorId) {
  const creator = await User.findById(creatorId);
  if (!creator) throw new Error("Creator user not found");

  // Create the community
  const community = new Community({
    name,
    description,
    creator: creatorId,
    admins: [creatorId],
    members: [creatorId]
  });

  // Save the community first
  const savedCommunity = await community.save();

  // Now create the default "General" subgroup
  try {
    await subGroupService.createSubGroup(
      "General",  // Default name
      "Default subgroup for general discussions",  // Default description
      savedCommunity._id,  // Community ID
      creatorId  // Admin of the subgroup (same as creator)
    );
  } catch (subGroupError) {
    // If subgroup creation fails, delete the community to maintain consistency
    await Community.findByIdAndDelete(savedCommunity._id);
    throw new Error(`Failed to create default subgroup: ${subGroupError.message}`);
  }

  return savedCommunity;
}

async function getCommunityById(communityId) {
  return Community.findById(communityId)
    .populate('creator')
    .populate('admins', 'name email')
    .populate('members', 'name email');
}



async function joinCommunity(communityId, userId) {
  const [community, user] = await Promise.all([
    Community.findById(communityId),
    User.findById(userId)
  ]);

  if (!community) throw new Error("Community not found");
  if (!user) throw new Error("User not found");

  // Check if already a member
  if (community.members.some(member => member.toString() === userId.toString())) {
    throw new Error("You're already a member");
  }

  community.members.push(userId);
  return await community.save();
}

async function addMemberToCommunity(communityId, userId, requesterId) {
  const [community, userToAdd] = await Promise.all([
    Community.findById(communityId),
    User.findById(userId)
  ]);

  if (!community) throw new Error("Community not found");
  if (!userToAdd) throw new Error("User not found");
  if (!requesterId) throw new Error("Authentication required");

  const isAdmin = community.admins.some(admin => 
    admin.toString() === requesterId.toString()
  );

  if (!isAdmin) {
    throw new Error("Only community admins can add members");
  }

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

async function addCommunityAdmin(communityId, creatorId, userId) {
  const community = await Community.findById(communityId);
  
  // Verify requester is the creator
  if (community.creator.toString() !== creatorId.toString()) {
    throw new Error("Only the community creator can add admins");
  }

  // Check if user is already an admin
  if (community.admins.some(admin => admin.toString() === userId.toString())) {
    throw new Error("User is already an admin");
  }

  community.admins.push(userId);
  return await community.save();
}

async function removeCommunityAdmin(communityId, creatorId, adminId) {
  const community = await Community.findById(communityId);
  
  // Verify requester is the creator
  if (community.creator.toString() !== creatorId.toString()) {
    throw new Error("Only the community creator can remove admins");
  }

  // Prevent removing yourself if you're the creator
  if (adminId.toString() === creatorId.toString()) {
    throw new Error("Creator cannot remove themselves as admin");
  }

  community.admins = community.admins.filter(
    admin => admin.toString() !== adminId.toString()
  );
  return await community.save();
}
async function transferAdmin(communityId, currentAdminId, newAdminId) {
  const community = await Community.findById(communityId);
  
  // Validate community exists
  if (!community) {
    throw new Error("Community not found");
  }

  // Verify current user is the creator
  if (community.creator.toString() !== currentAdminId.toString()) {
    throw new Error("Only the community creator can transfer admin rights");
  }

  // Verify new admin exists and is a community member
  const newAdmin = await User.findById(newAdminId);
  if (!newAdmin) {
    throw new Error("New admin user not found");
  }

  if (!community.members.some(member => member.toString() === newAdminId.toString())) {
    throw new Error("New admin must be a community member first");
  }

  community.creator = newAdminId;
  
  if (!community.admins.some(admin => admin.toString() === currentAdminId.toString())) {
    community.admins.push(currentAdminId);
  }

  if (!community.admins.some(admin => admin.toString() === newAdminId.toString())) {
    community.admins.push(newAdminId);
  }

  await community.save();
  return community;
}

// Add to communityService.js
async function canCreatorLeave(communityId, creatorId) {
  const community = await Community.findById(communityId);
  if (!community) throw new Error("Community not found");
  
  // Verify the user is actually the creator
  if (community.creator.toString() !== creatorId.toString()) {
    return true; 
  }
  
  // Creator can only leave if there are other admins
  return community.admins.length > 1;
}

async function leaveCommunity(communityId, userId) {
  const community = await Community.findById(communityId);
  if (!community) throw new Error("Community not found");

  // Check if user is the creator
  if (community.creator.toString() === userId.toString()) {
    const canLeave = await this.canCreatorLeave(communityId, userId);
    if (!canLeave) {
      throw new Error("Before leaving, transfer your creator rights to another admin");
    }
  }

  // Remove from members and admins
  community.members = community.members.filter(
    member => member.toString() !== userId.toString()
  );
  community.admins = community.admins.filter(
    admin => admin.toString() !== userId.toString()
  );

  return await community.save();
}


module.exports = {
  createCommunity,
  getCommunityById,
  addMemberToCommunity,
  joinCommunity,
  getCommunitiesForUser,
  isCommunityAdmin,
  isCommunityMember,
  addCommunityAdmin,
  removeCommunityAdmin,
  transferAdmin,
  leaveCommunity,
  canCreatorLeave
};