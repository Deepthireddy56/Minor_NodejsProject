
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Post content is required"],
    minlength: [5, "Post content must be at least 5 characters long"],
    maxlength: [500, "Post content must be under 500 characters"]
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community"
  },
  isCommunityPost: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model("Post", postSchema);