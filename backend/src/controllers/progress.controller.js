const UserProfile = require("../models/UserProfile");
const UserStat = require("../models/UserStat");
const { ensureUserProgress } = require("../services/userProgress.service");
const { applyRewardBundle } = require("../services/rewardEngine.service");

function buildProfilePayload(profile) {
  return {
    level: profile.level,
    xpTotal: profile.xpTotal,
    xpCurrentLevel: profile.xpCurrentLevel,
    xpNextLevel: profile.xpNextLevel,
    coins: profile.coins,
    streakCurrent: profile.streakCurrent,
    streakMax: profile.streakMax
  };
}

function buildStatsPayload(stats) {
  return stats.map((stat) => ({
    _id: stat._id,
    statKey: stat.statKey,
    level: stat.level,
    xp: stat.xp,
    xpMax: stat.xpMax,
    progressPercent:
      stat.xpMax > 0 ? Math.round((stat.xp / stat.xpMax) * 100) : 0
  }));
}

async function getProgressSummary(req, res) {
  try {
    const userId = req.user.userId;

    await ensureUserProgress(userId);

    const profile = await UserProfile.findOne({ userId });
    const stats = await UserStat.find({ userId }).sort({ statKey: 1 });

    return res.json({
      ok: true,
      profile: buildProfilePayload(profile),
      stats: buildStatsPayload(stats)
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: err.message
    });
  }
}

async function addGameReward(req, res) {
  try {
    const userId = req.user.userId;
    const { xp = 0, coins = 0, statKey = null } = req.body;
    const statRewards = statKey && xp > 0 ? [{ statKey, amount: Math.round(xp * 0.5) }] : [];
    const progress = await applyRewardBundle(userId, {
      globalXp: xp,
      coins: coins,
      statRewards,
      sourceType: "minigame",
      sourceId: `game_${Date.now()}`,
      bonusFlags: { gameReward: true }
    });
    return res.json({ ok: true, profile: progress.profile, stats: progress.stats });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  }
}

async function spendCoins(req, res) {
  try {
    const userId = req.user.userId;
    const amount = Math.round(Number(req.body?.amount || 0));

    if (!amount || amount <= 0) {
      return res.status(400).json({
        ok: false,
        message: "Debes enviar una cantidad valida para gastar"
      });
    }

    await ensureUserProgress(userId);

    const profile = await UserProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({
        ok: false,
        message: "Perfil no encontrado"
      });
    }

    if (profile.coins < amount) {
      return res.status(400).json({
        ok: false,
        message: "No tienes suficientes monedas"
      });
    }

    profile.coins -= amount;
    profile.coinsSpentTotal += amount;
    await profile.save();

    const stats = await UserStat.find({ userId }).sort({ statKey: 1 });

    return res.json({
      ok: true,
      profile: buildProfilePayload(profile),
      stats: buildStatsPayload(stats)
    });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  }
}

module.exports = {
  getProgressSummary,
  addGameReward,
  spendCoins
};
