const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    userID: { type: String },
    username: { type: String, unique: true, sparse: true },
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true
    },
    phone: Number,
    addresses: [
      {
        line1: String,
        line2: String,
        city: String,
        state: String,
        zip: String,
        primary: Boolean
      }
    ],
    password: String,
    profile: { 
      supervisor: String,
      billingCode: String,
     },
    wallet: Number,
    sizing: {
      collar: { type: Number, default: 0 },
      sleeve: { type: Number, default: 0 },
      shirt: { type: String, default: "no size on file" },
      waist: { type: Number, default: 0 },
      inseam: { type: Number, default: 0 }
    },
    role: { type: Number, default: 0 },
    resetToken: String,
    resetExpires: Date,
    stores: [String],
    metrics: {
      sessionCount: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

userSchema.pre("save", function(next) {
  const user = this;
  if (!user.password || !user.isModified("password")) return next();
  ModelClass.findById(this._id)
    .exec()
    .then(() => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) return next(err);
          user.password = hash;
          next();
        });
      });
    })
    .catch(err => next(err));
});

userSchema.methods.comparePassword = function(candidate, callback) {
  bcrypt.compare(candidate, this.password, function(err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

const ModelClass = mongoose.model("User", userSchema);

module.exports = ModelClass;
