const Match = require("../models/match");
const MatchId = require("../models/matchId");
const {Selections,PlayerList} = require("../models/selections");
const Users = require("../models/users");

//Function to calculate strikerate
const calculateStrikeRate = (runs, balls) => {
    return ((runs / balls) * 100).toFixed(2);
  };
  
  // Function to calculate economy
  const calculateEconomy = (runs, overs) => {
    if (overs==0) return 37;
    return (runs / overs).toFixed(2);
  };

const signup = async (req, res) => {
    let user = new Users(req.body);
    user.score = 0;
    user.selected=false;
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
        const scores = await Users.find({}, 'id name score')
            .sort({ score: -1 })
            .exec();
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
    const user = await Users.findOneAndUpdate({ id: req.body.id }, { selected: true });
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
    let matchData = req.body;
    // Add strike rate for each player in battingTeam1
    matchData.battingTeam1.forEach(player => {
    player.strikeRate = calculateStrikeRate(player.runs, player.balls);
  });
  
  // Add economy for each player in bowlingTeam1
  matchData.bowlingTeam1.forEach(player => {
    player.economy = calculateEconomy(player.runs_, player.overs);
  });
  
  // Add strike rate for each player in battingTeam2
  matchData.battingTeam2.forEach(player => {
    player.strikeRate = calculateStrikeRate(player.runs, player.balls);
  });
  
  // Add economy for each player in bowlingTeam2
  matchData.bowlingTeam2.forEach(player => {
    player.economy = calculateEconomy(player.runs_, player.overs);
  });
    let match = new Match(matchData);
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
        if(req.params.id==0)
        {
            res.status(201).json({message: "First Match is going" });
            return;
        }
        const match = await Match.find({id:req.params.id})
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
        if(req.params.id==0)
        {
            res.status(201).json({message: "First Match is going" });
            return;
        }
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
                playerScores[id] += 2*player.fours
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
                if(player.wickets >= 6){
                    playerScores[id] += Math.floor(player.wickets / 6) * 8;
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
                else if (eco <= 6) playerScores[id] += 1;
                else if (eco < 8) playerScores[id] -= 2;
                else if (eco < 9) playerScores[id] -= 4;
                else playerScores[id] -= 6;
            }
        });

        const users = await Selections.find({ mid: req.params.id });
        users.map((user,key) => {
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
            Users.updateOne({ id: user.id }, { $inc: { score: userScore }, $set: { selected: false } }, (err, result) => {
                if (err) {
                    console.log(err);
                }
            })
        })
        res.status(201).json({message: "Successfully Updated Score" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
const getMatchId = async (req,res) => {
    try {
        const match = await MatchId.find({});
        res.status(201).json({ data: match });
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}
const putMatchId  = async (req, res) => {
    let matchId = new MatchId({
        id:0
    });
    try {
        await matchId.save();
        res.status(201).json({ message: "Success, Selections Updated" });
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}
const patchMatchId  = async (req, res) => {
    try {
        const result = await MatchId.deleteMany({});
        let matchId = new MatchId({
            id:req.body.matchid
        });
        await matchId.save();
        res.status(201).json({ data:matchId,message: "Success, Match Updated" });
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}
const getPlayerList = async (req,res) => {
    try {
        const match = await Match.findOne({id:req.params.id});
        const players = await PlayerList.find({
            $or: [{ team: match.team1 }, { team: match.team2 }]
        });
        res.status(201).json({ data: players });
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}
const addPlayer  = async (req, res) => {
    let player = new PlayerList(req.body);
    try {
        await player.save();
        res.status(201).json({ message: "Player Saved" });
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}
const getSelected = async (req,res) => {
    try {
        const user = await Users.find({ id: req.params.id });
        res.status(201).json({ isSelected:user[0].selected, message: "Success" });
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}
const zeroMatchId  = async (req, res) => {
    try {
        const result = await MatchId.deleteMany({});
        let matchId = new MatchId({
            id:0
        });
        await matchId.save();
        res.status(201).json({ data:matchId,message: "Success, Match Updated" });
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}
const addPlayers  = async (req, res) => {
    try {
        let i;
        for(i=0;i<req.body.length;i++)
        {
            let player = new PlayerList(req.body[i]);
            await player.save();   
        }
        res.status(201).json({ message: "Players Saved" });
    }
    catch (err) {
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
    calculateScore,
    getMatchId,
    putMatchId,
    patchMatchId,
    addPlayer,
    getPlayerList,
    getSelected,
    zeroMatchId,
    addPlayers
} 