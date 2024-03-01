const express = require("express");
const router = express.Router();

const { signup, leaderboard, addSelection, getSelection, matchAdd, getRecentMatch, calculateScore, getMatchId, putMatchId, patchMatchId, addPlayer, getPlayerList, getSelected, zeroMatchId, addPlayers, incrementMatchId } = require("../controllers/controller");

router.post("/signup", signup);
router.get("/leaderboard", leaderboard);
router.post("/addSelection", addSelection);
router.get("/getSelection/:id", getSelection);
router.post("/addMatch", matchAdd);
router.get("/getMatch/:id", getRecentMatch);
router.get("/calculateScore/:id/:inningsid", calculateScore);
router.get("/getMatchId", getMatchId);
router.post("/putMatchId", putMatchId);//backend purpose 
router.patch("/patchMatchId", patchMatchId);
router.post("/addPlayerList", addPlayer);
router.post("/addPlayersList", addPlayers);
router.get("/getPlayerList/:id/:inningsid", getPlayerList);
router.get("/getSelected/:id/:inningsid", getSelected);
router.put("/zeroMatchId", zeroMatchId);

router.put("/incrementMatchId", incrementMatchId)
module.exports = router;