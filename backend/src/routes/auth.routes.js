const router = require("express").Router();
const { ping, register, login, me, updateProfile } = require("../controllers/auth.controller");
const { authRequired } = require("../middleware/auth.middleware");

router.get("/ping", ping);
router.post("/register", register);
router.post("/login", login);
router.get("/me", authRequired, me);
router.patch("/profile", authRequired, updateProfile);

module.exports = router;