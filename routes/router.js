const express = require("express");
const router = express.Router();

const { signup,leaderboard,addSelection,getSelection, matchAdd, getRecentMatch, calculateScore } = require("../controllers/controller");




router.post("/signup", signup);
router.get("/leaderboard", leaderboard);
router.post("/addSelection", addSelection);
router.get("/getSelection/:id", getSelection);
router.post("/addMatch", matchAdd);
router.get("/getMatch", getRecentMatch);
router.get("/calculateScore/:id",calculateScore)
module.exports = router;



