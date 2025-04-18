const communityService = require("../services/communityService");

async function createCommunity(req, res) {
  try {
    const { name, description } = req.body;
    const community = await communityService.createCommunity(name, description, req.userId);
    res.status(201).json({ 
      message: "Community created successfully", 
      community 
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Community name already exists" });
    }
    res.status(500).json({ error: err.message });
  }
}

async function getCommunityDetails(req, res) {
  try {
    const { communityId } = req.params;
    const community = await communityService.getCommunityById(communityId);
    if (!community) return res.status(404).json({ error: "Community not found" });
    res.json(community);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function joinCommunity(req, res) {
  try {
    const { communityId } = req.params;
    const community = await communityService.joinCommunity(
      communityId,
      req.userId
    );
    res.json({
      message: "Joined community successfully",
      community
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function addCommunityMember(req, res) {
  try {
    const { communityId, userId } = req.params;
    const community = await communityService.addMemberToCommunity(
      communityId, 
      userId,
      req.userId
    );
    res.json({ 
      message: "Member added to community successfully",
      community
    });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
}

async function getUserCommunities(req, res) {
  try {
    const communities = await communityService.getCommunitiesForUser(req.userId);
    res.json(communities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
async function removeMember(req, res) {
  try {
    const { communityId, memberId } = req.params;
    const community = await communityService.removeMember(
      communityId, 
      req.userId, 
      memberId
    );
    res.json({ message: "Member removed successfully", community });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function transferAdmin(req, res) {
  try {
    const { communityId, newAdminId } = req.params;
    const community = await communityService.transferAdmin(
      communityId,
      req.userId,
      newAdminId
    );
    res.json({ message: "Admin rights transferred", community });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
async function addAdmin(req, res) {
  try {
    const { communityId, userId } = req.params;
    const community = await communityService.addCommunityAdmin(
      communityId,
      req.userId,
      userId
    );
    res.json({ message: "Admin added successfully", community });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
}

async function removeAdmin(req, res) {
  try {
    const { communityId, adminId } = req.params;
    const community = await communityService.removeCommunityAdmin(
      communityId,
      req.userId,
      adminId
    );
    res.json({ message: "Admin removed successfully", community });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
async function leaveCommunity(req, res) {
  try {
    const { communityId } = req.params;
    const community = await communityService.leaveCommunity(communityId, req.userId);
    res.json({ 
      message: "Left community successfully",
      community
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  createCommunity,
  getCommunityDetails,
  joinCommunity,
  getUserCommunities,
  removeMember,
  transferAdmin,
  addAdmin,
  removeAdmin,
  leaveCommunity,
  addCommunityMember
};