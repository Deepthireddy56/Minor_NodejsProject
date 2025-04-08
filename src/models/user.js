const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema({
//   name: {type:String,required:true},
//   email: { type: String, unique: true, required: true },
//   password: { type: String, required: true },
//   friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
// });




const userSchema = new mongoose.Schema({
  name: {type:String, required:true},
  email: {type:String, required:true},
  password: {type:String, required:true},
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] 
});


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
