const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

var userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "You must provide a first name"],
  },
  lastname: {
    type: String,
    required: [true, "You must provide a last name"],
  },
  email: {
    type: String,
    required: [true, "Email address is required"],
  },
  password: {
    type: String,
    required: [true, "You must provide a password"],
  },
  isAdmin: { 
    type: Boolean,
    default: false,
  }
});

userSchema.pre("save",function(next) {
  bcrypt.genSalt(10)
  .then(salt => {
      bcrypt.hash(this.password,salt)
      .then(hash => {
          this.password = hash;
          next();
      })
      .catch(err=>console.log(`Error: ${err}`));
  })
  .catch(err=>console.log(`Error: ${err}`));
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
