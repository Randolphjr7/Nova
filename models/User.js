const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username : String,
  password : String,
  image: {
    type: String,
    default: "https://i.stack.imgur.com/oOE5V.jpg"
  }
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;