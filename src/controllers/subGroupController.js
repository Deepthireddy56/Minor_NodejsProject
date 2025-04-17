const subGroupService = require("../services/subGroupService");

async function createSubGroup(req, res) {
  try {
    const { name, description, communityId } = req.body;
    const subGroup = await subGroupService.createSubGroup(
      name,
      description,
      communityId,
      req.userId
    );
    res.status(201).json(subGroup);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function addMember(req, res) {
  try {
    const { subGroupId, userId } = req.params;
    const subGroup = await subGroupService.addSubGroupMember(
      subGroupId,
      userId,
      req.userId
    );
    res.json({ message: "Member added", subGroup });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
}


async function removeMember(req, res) {
    try {
      const { subGroupId, memberId } = req.params;
      const subGroup = await subGroupService.removeSubGroupMember(
        subGroupId,
        req.userId,
        memberId
      );
      res.json({ 
        message: memberId === req.userId ? 
          "Left subgroup successfully" : 
          "Member removed successfully",
        subGroup 
      });
    } catch (err) {
      res.status(403).json({ error: err.message });
    }
  }
  
  async function deleteSubGroup(req, res) {
    try {
      const { subGroupId } = req.params;
      const result = await subGroupService.deleteSubGroup(
        subGroupId,
        req.userId
      );
      res.json(result);
    } catch (err) {
      res.status(403).json({ error: err.message });
    }
  }

  async function joinSubGroup(req, res) {
    try {
      const { subGroupId } = req.params;
      const subGroup = await subGroupService.joinSubGroup(subGroupId, req.userId);
      res.json({ 
        message: "Joined subgroup successfully",
        subGroup 
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

module.exports={
    createSubGroup,
    addMember,
    removeMember,
    deleteSubGroup,
    joinSubGroup

}