const mongoose = require("mongoose");
const crypto = require("crypto");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userschema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please mention your name"],
  },
  email: {
    type: String,
    required: [true, "please provide email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "passwords are not same",
    },
  },
  number: {
    type: String,
    required: [true, "please provide a number"],
  },
});

userschema.pre("save", async function (next) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.ENCRYPTION_KEY, "hex"),
    iv
  );
  let encrypted = cipher.update(this.name);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  this.name = JSON.stringify({
    iv: iv.toString("hex"),
    encryptedData: encrypted.toString("hex"),
  });
  next();
});
// userschema.pre("save", async function (next) {
//   const algorithm = "aes-256-cbc";
//   const iv = crypto.randomBytes(16);

//   const cipher = crypto.createCipheriv(algorithm, key, iv);
//   let encrypted = cipher.update(this.email, "utf8", "hex");
//   encrypted += cipher.final("hex");
//   this.email = {
//     iv: iv.toString("hex"),
//     encryptedData: encrypted,
//   };
//   next();
// });
userschema.pre("save", async function (next) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.ENCRYPTION_KEY, "hex"),
    iv
  );
  let encrypted = cipher.update(this.number);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  this.number = JSON.stringify({
    iv: iv.toString("hex"),
    encryptedData: encrypted.toString("hex"),
  });
  next();
});

userschema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
//instance method available to all objects of the collection
userschema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("userauth", userschema);
module.exports = User;
