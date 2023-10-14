const express = require("express");
const router = express.Router();

const { signup,leaderboard,addSelection,getSelection, matchAdd, getRecentMatch } = require("../controllers/controller");




router.post("/signup", signup);
router.get("/leaderboard", leaderboard);
router.post("/addSelection", addSelection);
router.get("/getSelection/:id", getSelection);
router.post("/addMatch", matchAdd);
router.get("/getMatch", getRecentMatch);

module.exports = router;



