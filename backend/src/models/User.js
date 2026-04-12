const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, minlength: 3 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },

    birthdate: { type: Date, default: null },

    // RPG basics
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },

    // Para multi-dispositivo (útil para sync)
    lastSyncAt: { type: Date, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);