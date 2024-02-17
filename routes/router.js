const express = require("express");
const router = express.Router();

const { signup,leaderboard,addSelection,getSelection, matchAdd, getRecentMatch, calculateScore, getMatchId, putMatchId, patchMatchId, addPlayer, getPlayerList, getSelected, zeroMatchId, addPlayers } = require("../controllers/controller");

router.post("/signup", signup);
router.get("/leaderboard", leaderboard);
router.post("/addSelection", addSelection);
router.get("/getSelection/:id", getSelection);
router.post("/addMatch", matchAdd);
router.get("/getMatch/:id", getRecentMatch);
router.get("/calculateScore/:id",calculateScore);
router.get("/getMatchId",getMatchId);
router.post("/putMatchId", putMatchId);//backend purpose 
router.patch("/patchMatchId", patchMatchId);
router.post("/addPlayerList",addPlayer);
router.post("/addPlayersList",addPlayers);
router.get("/getPlayerList/:id",getPlayerList);
router.get("/getSelected/:id",getSelected);
router.put("/zeroMatchId",zeroMatchId);

module.exports = router;