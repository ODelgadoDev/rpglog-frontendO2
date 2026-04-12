const UserProfile = require("../models/UserProfile");
const UserStat = require("../models/UserStat");
const XpLog = require("../models/XpLog");
const { ensureUserProgress } = require("./userProgress.service");
const {
  calculateGlobalProgress,
  calculateStatProgress
} = require("../utils/progression");

async function applyQuestReward(userId, quest) {
  return applyRewardBundle(userId, {
    globalXp: typeof quest.globalXpReward === "number" ? quest.globalXpReward : quest.xpReward || 0,
    coins: quest.coinReward || 0,
    statRewards: Array.isArray(quest.statRewards) ? quest.statRewards : [],
    sourceType: mapQuestTypeToSourceType(quest.type),
    sourceId: quest._id.toString(),
    bonusFlags: {
      questType: quest.type
    }
  });
}

async function applyPhotoEvidenceReward(userId, quest) {
  return applyRewardBundle(userId, {
    globalXp: quest.photoBonusXp || 0,
    coins: quest.photoBonusCoins || 0,
    statRewards: Array.isArray(quest.photoBonusStatRewards) ? quest.photoBonusStatRewards : [],
    sourceType: "quest_photo_evidence",
    sourceId: quest._id.toString(),
    bonusFlags: {
      evidenceType: "photo"
    }
  });
}

async function applyLocationEvidenceReward(userId, quest) {
  return applyRewardBundle(userId, {
    globalXp: quest.locationBonusXp || 0,
    coins: quest.locationBonusCoins || 0,
    statRewards: Array.isArray(quest.locationBonusStatRewards) ? quest.locationBonusStatRewards : [],
    sourceType: "quest_location_evidence",
    sourceId: quest._id.toString(),
    bonusFlags: {
      evidenceType: "location"
    }
  });
}

async function applyRewardBundle(userId, bundle) {
  await ensureUserProgress(userId);

  const profile = await UserProfile.findOne({ userId });
  if (!profile) {
    throw new Error("UserProfile no encontrado");
  }

  const globalXpToAdd = bundle.globalXp || 0;
  const coinsToAdd = bundle.coins || 0;
  const statRewards = Array.isArray(bundle.statRewards) ? bundle.statRewards : [];

  profile.xpTotal += globalXpToAdd;
  profile.coins += coinsToAdd;
  profile.coinsEarnedTotal += coinsToAdd;

  const globalProgress = calculateGlobalProgress(profile.xpTotal);
  profile.level = globalProgress.level;
  profile.xpCurrentLevel = globalProgress.xpCurrentLevel;
  profile.xpNextLevel = globalProgress.xpNextLevel;

  await profile.save();

  if (globalXpToAdd > 0) {
    await XpLog.create({
      userId,
      amount: globalXpToAdd,
      amountFinal: globalXpToAdd,
      sourceType: bundle.sourceType,
      sourceId: bundle.sourceId,
      statKey: null,
      bonusFlags: {
        ...bundle.bonusFlags,
        coinsGranted: coinsToAdd
      }
    });
  }

  for (const reward of statRewards) {
    const stat = await UserStat.findOne({
      userId,
      statKey: reward.statKey
    });

    if (!stat) continue;

    stat.xp += reward.amount;

    const statProgress = calculateStatProgress(stat.xp);
    stat.level = statProgress.level;
    stat.xpMax = statProgress.xpMax;

    await stat.save();

    await XpLog.create({
      userId,
      amount: reward.amount,
      amountFinal: reward.amount,
      sourceType: bundle.sourceType,
      sourceId: bundle.sourceId,
      statKey: reward.statKey,
      bonusFlags: bundle.bonusFlags || {}
    });
  }

  const updatedStats = await UserStat.find({ userId }).sort({ statKey: 1 });

  return {
    profile,
    stats: updatedStats
  };
}

function mapQuestTypeToSourceType(type) {
  switch (type) {
    case "weekly":
      return "weekly_mission";
    case "special":
      return "special_mission";
    case "custom":
      return "custom_mission";
    case "daily":
    default:
      return "daily_mission";
  }
}

module.exports = {
  applyQuestReward,
  applyPhotoEvidenceReward,
  applyLocationEvidenceReward,
  applyRewardBundle,
};