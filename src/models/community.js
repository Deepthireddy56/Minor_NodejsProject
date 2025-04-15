const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Community name is required"],
    minlength: [3, "Community name must be at least 3 characters long"],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    maxlength: [200, "Description must be under 200 characters"]
  },
  creator: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }],
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  role: {
    type: String,
    enum: ["member", "admin"],
    default: "member"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Community", communitySchema);