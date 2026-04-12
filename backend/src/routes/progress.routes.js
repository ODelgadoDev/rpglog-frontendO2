const router = require("express").Router();
const { authRequired } = require("../middleware/auth.middleware");
const {
  getProgressSummary,
  addGameReward,
  spendCoins
} = require("../controllers/progress.controller");

router.use(authRequired);

router.get("/summary", getProgressSummary);
router.post("/game-reward", addGameReward);
router.post("/spend-coins", spendCoins);

module.exports = router;
