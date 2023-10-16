const Match = require("../models/match");
const Selections = require("../models/selections");
const Users = require("../models/users");


const signup = async (req, res) => {
    let user = new Users(req.body);
    user.score = 0;
    try {
        const post = await Users.find({ id: req.body.id });
        if (post.length === 0) {
            await user.save();
            res.status(201).json({ message: "Success" });
        }
        else {
            res.status(409).json({ message: "User Exist already" });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const leaderboard = async (req, res) => {
    try {
        const scores = await Scores.find({});
        if (scores.length === 0) {
            res.status(409).json({ message: "No Users,No leaderboard" });
        }
        else {
            res.status(201).json({ data: scores, message: "Leaderboard, Successful" });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const addSelection = async (req, res) => {
    let selection = new Selections(req.body);
    try {
        await selection.save();
        res.status(201).json({ message: "Success, Selections Updated" });
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const getSelection = async (req, res) => {
    try {
        const selections = await Selections.find({ id: req.params.id })
            .sort({ createdAt: -1 })
            .limit(1)
            .select('selection');
        if (selections.length === 0) {
            res.status(409).json({ message: "Select the player first" });
        }
        else {
            res.status(201).json({ data: selections, message: "Your Recent Selection, Successful" });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const matchAdd = async (req, res) => {
    let match = new Match(req.body);
    try {
        await match.save();
        res.status(201).json({ message: "Success, Match Updated" });
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const getRecentMatch = async (req, res) => {
    try {
        const match = await Match.find()
            .sort({ createdAt: -1 })
            .limit(1)
        if (match.length === 0) {
            res.status(409).json({ message: "Match not started yet" });
        }
        else {
            res.status(201).json({ data: match, message: "Live Match" });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}
const calculateScore = async (req, res) => {
    try {
        const match = await Match.findOne({ id: req.params.id })
        let players = [];
        players.push(...match.battingTeam1);
        players.push(...match.battingTeam2);
        players.push(...match.bowlingTeam1);
        players.push(...match.bowlingTeam2);
        let playerScores = {};
        players.forEach((player) => {
            const id = player.id;
            if (!playerScores[id]) {
                playerScores[id] = 0;
            }
            if ("runs" in player) {
                playerScores[id] += player.runs;
                playerScores[id] += Math.floor(player.runs / 50) * 4;
                playerScores[id] += Math.floor(player.runs / 100) * 8;
                if (player.runs === 0) {
                    playerScores[id] -= 3;
                }
            }
            if("fours" in player){
                playerScores[id] += player.fours
            }
            if("sixes" in player){
                playerScores[id] += 3*player.sixes
            }
            if ("wickets" in player) {
                playerScores[id] += player.wickets * 25;
                if (player.wickets >= 3) {
                    playerScores[id] += Math.floor(player.wickets / 3) * 4;
                }
                if (player.wickets >= 4) {
                    playerScores[id] += Math.floor(player.wickets / 4) * 8;
                }
            }
            if ("maidens" in player) {
                playerScores[id] += player.maidens * 4;
            }
            if ("strikeRate" in player) {
                const sr = player.strikeRate;
                if (sr > 140) playerScores[id] += 6;
                else if (sr > 120) playerScores[id] += 4;
                else if (sr > 100) playerScores[id] += 2;
                else if (sr > 40) playerScores[id] -= 2;
                else if (sr > 30) playerScores[id] -= 4;
                else playerScores[id] -= 6;
            }
            if ("economy" in player) {
                const eco = player.economy;
                if (eco < 2.5) playerScores[id] += 6;
                else if (eco < 3.5) playerScores[id] += 4;
                else if (eco < 4.5) playerScores[id] += 2;
                else if (eco < 8) playerScores[id] -= 2;
                else if (eco < 9) playerScores[id] -= 4;
                else playerScores[id] -= 6;
            }
        });

        const users = await Selections.find({ mid: req.params.id });
        users.map((user) => {
            let userScore = 0;
            user.selection.map((player) => {
                if(playerScores[player.id] !== undefined){
                    if(player.playerRole === "captain"){
                        userScore += 2*playerScores[player.id];
                    }else if(player.playerRole === "viceCaptain"){
                        userScore += 1.5*playerScores[player.id];
                    }else{
                        userScore += playerScores[player.id];
                    }
                }
            })
            Users.updateOne({ id: user.id }, { $inc: { score: userScore } }, (err, result) => {
                if (err) {
                    console.log(err);
                }
            })
        })
        res.status(201).json({data: playerScores,message: "Successfully Updated Score" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
module.exports = {
    signup,
    leaderboard,
    addSelection,
    getSelection,
    matchAdd,
    getRecentMatch,
    calculateScore
} 