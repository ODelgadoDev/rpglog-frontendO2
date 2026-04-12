const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },

    xpTotal: { type: Number, default: 0, min: 0 },
    level: { type: Number, default: 1, min: 1 },
    xpCurrentLevel: { type: Number, default: 0, min: 0 },
    xpNextLevel: { type: Number, default: 1000, min: 1 },

    coins: { type: Number, default: 0, min: 0 },
    coinsEarnedTotal: { type: Number, default: 0, min: 0 },
    coinsSpentTotal: { type: Number, default: 0, min: 0 },

    streakCurrent: { type: Number, default: 0, min: 0 },
    streakMax: { type: Number, default: 0, min: 0 },
    streakProtected: { type: Number, default: 0, min: 0 },

    equippedTitleId: { type: String, default: null },
    customSlots: { type: Number, default: 1, min: 1, max: 2 }
    ,
    notifPrefs: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProfile", userProfileSchema);