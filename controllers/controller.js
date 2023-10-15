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
const updateArray = (array, id, score) => {
    array = array.map((item) => {
        if (item.id === id) {
            let oldScore = item.score;
            let newScore = oldScore+score;
            return { ...item, score: newScore }; // Update the score for the specific item
        }
        return item;
    });
    return array;
}
const calculateScore = async (req, res) => {
    try {
        const match = await Match.findOne({ id: req.params.id })
        let players = []
        players.push(...match.battingTeam1);
        players.push(...match.battingTeam2);
        players.push(...match.bowlingTeam1);
        players.push(...match.bowlingTeam2);
        let score = []
        players.map((player) => {
            const id = player.id;
            if (!(id in score)) {
                score = [...score, { id: player.id, score:0}]
            }
            if ("runs" in player) {
                score = updateArray(score,id,player.runs)
                score = updateArray(score,id,Math.floor(player.runs/50)*4)
                score = updateArray(score,id,Math.floor(player.runs/100)*8)
                if(player.runs == 0) score = updateArray(score,id,-3)
            }
            if ("fours" in player){
                score = updateArray(score,id,player.fours)
            }
            if("sixes" in player){
                score = updateArray(score,id,player.sixes*3)
            }
            if("wickets" in player){
                score = updateArray(score,id,player.wickets*25)
                score = updateArray(score,id,Math.floor(player.wickets/3)*4)
                score = updateArray(score,id,Math.floor(player.wickets/4)*8)
            }
            if("maidens" in player){
                score = updateArray(score,id,player.maidens*4)
            }
            if("strikeRate" in player){
                let sr = player.strikeRate;
                if(sr > 140) score = updateArray(score,id,6)
                else if(sr > 120) score = updateArray(score,id,4)
                else if(sr > 100) score = updateArray(score,id,2)
                else if(sr > 40) score = updateArray(score,id,-2)
                else if(sr > 30) score = updateArray(score,id,-4)
                else score = updateArray(score,id,-6)
            }
            if("economy" in player){
                let eco = player.economy;
                if(eco < 2.5) score = updateArray(score,id,6)
                else if(eco < 3.5) score = updateArray(score,id,4)
                else if(eco < 4.5) score = updateArray(score,id,2)
                else if(eco < 8) score = updateArray(score,id,-2)
                else if(eco < 9) score = updateArray(score,id,-4)
                else score = updateArray(score,id,-6)
            }
        })
        res.status(201).json({ data: score });
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