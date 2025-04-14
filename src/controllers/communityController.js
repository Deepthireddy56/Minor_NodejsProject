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
    const community = await communityService.addMemberToCommunity(communityId, req.userId);
    res.json({ 
      message: "Joined community successfully",
      community
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

module.exports = {
  createCommunity,
  getCommunityDetails,
  joinCommunity,
  getUserCommunities
};