const mongoose = require("mongoose");
const Quest = require("../models/Quest");
const { DAILY_QUESTS } = require("../utils/dailyQuests");
const {
  applyQuestReward,
  applyPhotoEvidenceReward,
  applyLocationEvidenceReward
} = require("../services/rewardEngine.service");

const DAILY_WINDOW_MS = 6 * 60 * 60 * 1000;

function getCurrentDailyWindowKey() {
  return `daily_${Math.floor(Date.now() / DAILY_WINDOW_MS)}`;
}

async function listQuests(req, res) {
  try {
    const userId = req.user.userId;

    const quests = await Quest.find({
      userId,
      deleted: false
    }).sort({ createdAt: -1 });

    return res.json({ ok: true, quests });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: err.message
    });
  }
}

async function listCustomQuests(req, res) {
  try {
    const userId = req.user.userId;

    const quests = await Quest.find({
      userId,
      type: "custom",
      deleted: false
    }).sort({ createdAt: -1 });

    return res.json({ ok: true, quests });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: err.message
    });
  }
}

async function createQuest(req, res) {
  try {
    const userId = req.user.userId;

    const body = req.body || {};
    const {
      title,
      description = "",
      type = "daily",
      xpReward = 10,
      globalXpReward,
      coinReward = 0,
      statRewards = [],

      photoEvidenceEnabled = false,
      locationEvidenceEnabled = false,

      photoBonusXp = 0,
      photoBonusCoins = 0,
      photoBonusStatRewards = [],

      locationBonusXp = 0,
      locationBonusCoins = 0,
      locationBonusStatRewards = []
    } = body;

    if (!title) {
      return res.status(400).json({
        ok: false,
        message: "title es requerido"
      });
    }

    const quest = await Quest.create({
      userId,
      title,
      description,
      type,
      xpReward,
      globalXpReward: typeof globalXpReward === "number" ? globalXpReward : xpReward,
      coinReward,
      statRewards,

      photoEvidenceEnabled,
      locationEvidenceEnabled,

      photoBonusXp,
      photoBonusCoins,
      photoBonusStatRewards,

      locationBonusXp,
      locationBonusCoins,
      locationBonusStatRewards
    });

    return res.status(201).json({ ok: true, quest });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: err.message
    });
  }
}

async function createCustomQuest(req, res) {
  try {
    const userId = req.user.userId;

    const body = req.body || {};
    const {
      title,
      description = "",
      xpReward = 10,
      globalXpReward,
      coinReward = 0,
      statRewards = [],

      photoEvidenceEnabled = false,
      locationEvidenceEnabled = false,

      photoBonusXp = 0,
      photoBonusCoins = 0,
      photoBonusStatRewards = [],

      locationBonusXp = 0,
      locationBonusCoins = 0,
      locationBonusStatRewards = []
    } = body;

    if (!title) {
      return res.status(400).json({
        ok: false,
        message: "title es requerido"
      });
    }

    const quest = await Quest.create({
      userId,
      title,
      description,
      type: "custom",
      xpReward,
      globalXpReward: typeof globalXpReward === "number" ? globalXpReward : xpReward,
      coinReward,
      statRewards,

      photoEvidenceEnabled,
      locationEvidenceEnabled,

      photoBonusXp,
      photoBonusCoins,
      photoBonusStatRewards,

      locationBonusXp,
      locationBonusCoins,
      locationBonusStatRewards
    });

    return res.status(201).json({
      ok: true,
      message: "Custom quest creada",
      quest
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: err.message
    });
  }
}

async function updateCustomQuest(req, res) {
  try {
    const userId = req.user.userId;
    const questId = req.params.id;

    const quest = await Quest.findOne({
      _id: questId,
      userId,
      type: "custom",
      deleted: false
    });

    if (!quest) {
      return res.status(404).json({
        ok: false,
        message: "Custom quest no encontrada"
      });
    }

    const body = req.body || {};
    const {
      title,
      description,
      xpReward,
      globalXpReward,
      coinReward,
      statRewards,

      photoEvidenceEnabled,
      locationEvidenceEnabled,

      photoBonusXp,
      photoBonusCoins,
      photoBonusStatRewards,

      locationBonusXp,
      locationBonusCoins,
      locationBonusStatRewards
    } = body;

    if (typeof title !== "undefined") quest.title = title;
    if (typeof description !== "undefined") quest.description = description;
    if (typeof xpReward !== "undefined") quest.xpReward = xpReward;
    if (typeof globalXpReward !== "undefined") quest.globalXpReward = globalXpReward;
    if (typeof coinReward !== "undefined") quest.coinReward = coinReward;
    if (typeof statRewards !== "undefined") quest.statRewards = statRewards;

    if (typeof photoEvidenceEnabled !== "undefined") quest.photoEvidenceEnabled = photoEvidenceEnabled;
    if (typeof locationEvidenceEnabled !== "undefined") quest.locationEvidenceEnabled = locationEvidenceEnabled;

    if (typeof photoBonusXp !== "undefined") quest.photoBonusXp = photoBonusXp;
    if (typeof photoBonusCoins !== "undefined") quest.photoBonusCoins = photoBonusCoins;
    if (typeof photoBonusStatRewards !== "undefined") quest.photoBonusStatRewards = photoBonusStatRewards;

    if (typeof locationBonusXp !== "undefined") quest.locationBonusXp = locationBonusXp;
    if (typeof locationBonusCoins !== "undefined") quest.locationBonusCoins = locationBonusCoins;
    if (typeof locationBonusStatRewards !== "undefined") quest.locationBonusStatRewards = locationBonusStatRewards;

    await quest.save();

    return res.json({
      ok: true,
      message: "Custom quest actualizada",
      quest
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: err.message
    });
  }
}

async function completeQuest(req, res) {
  try {
    const userId = req.user.userId;
    const questId = req.params.id;

    const quest = await Quest.findOne({
      _id: questId,
      userId,
      deleted: false
    });

    if (!quest) {
      return res.status(404).json({
        ok: false,
        message: "Quest no encontrada"
      });
    }

    if (quest.completed) {
      return res.json({
        ok: true,
        message: "Ya estaba completada",
        quest
      });
    }

    quest.completed = true;
    quest.completedAt = new Date();
    await quest.save();

    const progress = await applyQuestReward(userId, quest);

    return res.json({
      ok: true,
      message: "Quest completada y recompensa aplicada",
      quest,
      profile: progress.profile,
      stats: progress.stats
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: err.message
    });
  }
}

async function submitPhotoEvidence(req, res) {
  try {
    const userId = req.user.userId;
    const questId = req.params.id;

    const quest = await Quest.findOne({
      _id: questId,
      userId,
      deleted: false
    });

    if (!quest) {
      return res.status(404).json({
        ok: false,
        message: "Quest no encontrada"
      });
    }

    if (!quest.completed) {
      return res.status(400).json({
        ok: false,
        message: "Primero debes completar la quest"
      });
    }

    if (!quest.photoEvidenceEnabled) {
      return res.status(400).json({
        ok: false,
        message: "Esta quest no permite evidencia con foto"
      });
    }

    if (quest.photoBonusApplied) {
      return res.status(400).json({
        ok: false,
        message: "La evidencia de foto ya fue enviada"
      });
    }

    quest.photoEvidenceSubmitted = true;
    quest.photoEvidenceSubmittedAt = new Date();
    quest.photoBonusApplied = true;
    await quest.save();

    const progress = await applyPhotoEvidenceReward(userId, quest);

    return res.json({
      ok: true,
      message: "Evidencia de foto registrada y bonus aplicado",
      quest,
      profile: progress.profile,
      stats: progress.stats
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: err.message
    });
  }
}

async function submitLocationEvidence(req, res) {
  try {
    const userId = req.user.userId;
    const questId = req.params.id;

    const { latitude, longitude, accuracy = null, capturedAt = null } = req.body || {};

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return res.status(400).json({
        ok: false,
        message: "latitude y longitude son requeridos y deben ser numéricos"
      });
    }

    const quest = await Quest.findOne({
      _id: questId,
      userId,
      deleted: false
    });

    if (!quest) {
      return res.status(404).json({
        ok: false,
        message: "Quest no encontrada"
      });
    }

    if (!quest.completed) {
      return res.status(400).json({
        ok: false,
        message: "Primero debes completar la quest"
      });
    }

    if (!quest.locationEvidenceEnabled) {
      return res.status(400).json({
        ok: false,
        message: "Esta quest no permite evidencia con ubicación"
      });
    }

    if (quest.locationBonusApplied) {
      return res.status(400).json({
        ok: false,
        message: "La evidencia de ubicación ya fue enviada"
      });
    }

    quest.locationEvidenceSubmitted = true;
    quest.locationEvidenceSubmittedAt = new Date();
    quest.locationBonusApplied = true;

    quest.location = {
      type: "Point",
      coordinates: [longitude, latitude]
    };

    quest.locationAccuracy = accuracy;
    quest.locationCapturedAt = capturedAt ? new Date(capturedAt) : new Date();

    await quest.save();

    const progress = await applyLocationEvidenceReward(userId, quest);

    return res.json({
      ok: true,
      message: "Ubicación registrada y bonus aplicado",
      quest,
      profile: progress.profile,
      stats: progress.stats
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: err.message
    });
  }
}

async function deleteQuest(req, res) {
  try {
    const userId = req.user.userId;
    const questId = req.params.id;

    const quest = await Quest.findOne({
      _id: questId,
      userId,
      deleted: false
    });

    if (!quest) {
      return res.status(404).json({
        ok: false,
        message: "Quest no encontrada"
      });
    }

    quest.deleted = true;
    await quest.save();

    return res.json({
      ok: true,
      message: "Quest eliminada",
      questId
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: err.message
    });
  }
}

async function deleteCustomQuest(req, res) {
  try {
    const userId = req.user.userId;
    const questId = req.params.id;

    const quest = await Quest.findOne({
      _id: questId,
      userId,
      type: "custom",
      deleted: false
    });

    if (!quest) {
      return res.status(404).json({
        ok: false,
        message: "Custom quest no encontrada"
      });
    }

    quest.deleted = true;
    await quest.save();

    return res.json({
      ok: true,
      message: "Custom quest eliminada",
      questId
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: err.message
    });
  }
}

async function seedDailyQuests(req, res) {
  try {
    const userId = req.user.userId;
    const dayKey = getCurrentDailyWindowKey();

    const existingToday = await Quest.find({
      userId,
      type: "daily",
      dayKey,
      deleted: false
    });

    if (existingToday.length > 0) {
      return res.json({
        ok: true,
        message: "Las quests diarias de hoy ya existen",
        quests: existingToday
      });
    }

    const questsToInsert = DAILY_QUESTS.map((quest) => ({
      userId,
      title: quest.title,
      description: quest.description,
      type: quest.type,
      xpReward: quest.xpReward ?? quest.globalXpReward ?? 10,
      globalXpReward: quest.globalXpReward ?? quest.xpReward ?? 10,
      coinReward: quest.coinReward ?? 0,
      statRewards: quest.statRewards ?? [],
      dayKey,

      photoEvidenceEnabled: quest.photoEvidenceEnabled ?? false,
      locationEvidenceEnabled: quest.locationEvidenceEnabled ?? false,

      photoBonusXp: quest.photoBonusXp ?? 0,
      photoBonusCoins: quest.photoBonusCoins ?? 0,
      photoBonusStatRewards: quest.photoBonusStatRewards ?? [],

      locationBonusXp: quest.locationBonusXp ?? 0,
      locationBonusCoins: quest.locationBonusCoins ?? 0,
      locationBonusStatRewards: quest.locationBonusStatRewards ?? []
    }));

    const createdQuests = await Quest.insertMany(questsToInsert);

    return res.status(201).json({
      ok: true,
      message: "Quests diarias generadas",
      quests: createdQuests
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: err.message
    });
  }
}

async function getQuestHistory(req, res) {
  try {
    const userId = req.user.userId;

    const quests = await Quest.find({
      userId,
      completed: true
    })
      .sort({ completedAt: -1 })
      .select("title type completedAt globalXpReward coinReward statRewards photoEvidenceSubmitted locationEvidenceSubmitted");

    return res.json({
      ok: true,
      count: quests.length,
      history: quests
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: err.message
    });
  }
}

async function getQuestHistorySummary(req, res) {
  try {
    const userId = req.user.userId;

    const summary = await Quest.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          completed: true
        }
      },
      {
        $addFields: {
          normalizedTitle: {
            $toLower: "$title"
          }
        }
      },
      {
        $group: {
          _id: "$normalizedTitle",
          title: { $first: "$title" },
          count: { $sum: 1 },
          firstCompletedAt: { $min: "$completedAt" },
          lastCompletedAt: { $max: "$completedAt" },
          dates: { $push: "$completedAt" }
        }
      },
      {
        $sort: { count: -1, lastCompletedAt: -1 }
      }
    ]);

    return res.json({
      ok: true,
      count: summary.length,
      summary
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: err.message
    });
  }
}

module.exports = {
  listQuests,
  listCustomQuests,
  createQuest,
  createCustomQuest,
  updateCustomQuest,
  completeQuest,
  submitPhotoEvidence,
  submitLocationEvidence,
  deleteQuest,
  deleteCustomQuest,
  seedDailyQuests,
  getQuestHistory,
  getQuestHistorySummary
};
