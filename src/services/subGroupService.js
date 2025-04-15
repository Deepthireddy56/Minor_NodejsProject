const SubGroup = require("../models/subGroup");
const Community = require("../models/community");
const User = require("../models/user");
const Post = require("../models/posts");

async function createSubGroup(name, description, communityId, adminId) {
 
  const community = await Community.findById(communityId);
  if (!community.members.includes(adminId)) {
    throw new Error("Only community members can create subgroups");
  }

  const subGroup = new SubGroup({
    name,
    description,
    community: communityId,
    admin: adminId,
    members: [adminId] 
  });

  return await subGroup.save();
}

async function addSubGroupMember(subGroupId, userId, requesterId) {
  try {
    const [subGroup, userToAdd] = await Promise.all([
      SubGroup.findById(subGroupId).populate('community'),
      User.findById(userId)
    ]);

    if (!subGroup) throw new Error("Subgroup not found");
    if (!userToAdd) throw new Error("User not found");

    const isSubGroupAdmin = subGroup.admin.toString() === requesterId.toString();
    const isCommunityAdmin = subGroup.community.admins.some(admin => 
      admin.toString() === requesterId.toString()
    );

    if (!isSubGroupAdmin && !isCommunityAdmin) {
      throw new Error("Not authorized to add members");
    }

    if (subGroup.members.some(member => member.toString() === userId.toString())) {
      throw new Error("User is already a member");
    }

    subGroup.members.push(userId);
    await subGroup.save();
    return subGroup;
    
  } catch (err) {
    throw err; 
  }
}


async function removeSubGroupMember(subGroupId, requesterId, memberId) {

  const subGroup = await SubGroup.findById(subGroupId).populate('community');
  if (!subGroup) throw new Error("Subgroup not found");

  const memberToRemove = await User.findById(memberId);
  if (!memberToRemove) throw new Error("Member not found");

  const isSubGroupAdmin = subGroup.admin && 
                         subGroup.admin.toString() === requesterId.toString();
  const isCommunityAdmin = subGroup.community && 
                          subGroup.community.admins.some(admin => 
                            admin && admin.toString() === requesterId.toString()
                          );
  const isSelfRemoval = memberId.toString() === requesterId.toString();

  if (!isSubGroupAdmin && !isCommunityAdmin && !isSelfRemoval) {
    throw new Error("Not authorized to remove members");
  }

  if (subGroup.admin && 
      subGroup.admin.toString() === memberId.toString() && 
      !isSelfRemoval) {
    throw new Error("Subgroup admin can only leave, not be removed");
  }

  subGroup.members = subGroup.members.filter(
    member => member && member.toString() !== memberId.toString()
  );

  await subGroup.save();
  return subGroup;
}


async function deleteSubGroup(subGroupId, requesterId) {
  try {

    const subGroup = await SubGroup.findById(subGroupId)
      .populate('community')
      .populate('admin');
    
    if (!subGroup) {
      throw new Error("Subgroup not found");
    }

  
    const isSubGroupAdmin = subGroup.admin && 
                          subGroup.admin._id.toString() === requesterId.toString();
    
    const isCommunityAdmin = subGroup.community && 
                           subGroup.community.admins.some(admin => 
                             admin && admin.toString() === requesterId.toString()
                           );

    if (!isSubGroupAdmin && !isCommunityAdmin) {
      throw new Error("Only admins can delete subgroups");
    }

    await Post.deleteMany({ subGroup: subGroupId });

    await SubGroup.findByIdAndDelete(subGroupId);

    return { message: "Subgroup deleted successfully" };
    
  } catch (error) {
    console.error("Error deleting subgroup:", error);
    throw error;
  }
}


module.exports={
    createSubGroup,
    addSubGroupMember,
    removeSubGroupMember,
    deleteSubGroup
}