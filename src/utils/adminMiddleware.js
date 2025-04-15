const Community = require('../models/community');

async function communityAdminMiddleware(req, res, next) {
  try {
    const { communityId } = req.params;
    const community = await Community.findById(communityId);
    
    if (!community) {
      return res.status(404).json({ error: "Community not found" });
    }

    // Check if user is creator OR admin
    const isAuthorized = community.creator.equals(req.userId) || 
                        community.admins.some(admin => admin.equals(req.userId));
    
    if (!isAuthorized) {
      return res.status(403).json({ error: "Admin privileges required" });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = communityAdminMiddleware;