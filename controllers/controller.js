const Match = require("../models/match");
const Scores = require("../models/scores");
const Selections = require("../models/selections");
const Users=require("../models/users");


const signup = async (req,res) => {
    let user = new Users(req.body);
    let score = new Scores({
        id:req.body.id,
        score:0
    })
    try 
    {
        const post = await Users.find({id:req.body.id});
        if(post.length===0)
        {
            await user.save();
            await score.save();
            res.status(201).json({message: "Success"});   
        }
        else
        {
            res.status(409).json({message: "User Exist already"}); 
        }
    } 
    catch(err) 
    {
        res.status(500).json({ message: err.message })
    }
}

const leaderboard = async (req,res) => {
    try 
    {
        const scores = await Scores.find({});
        if(scores.length===0)
        {
            res.status(409).json({message: "No Users,No leaderboard"});   
        }
        else
        {
            res.status(201).json({data:scores,message: "Leaderboard, Successful"}); 
        }
    } 
    catch(err) 
    {
        res.status(500).json({ message: err.message })
    }
}

const addSelection = async (req,res) => {
    let selection = new Selections(req.body);
    try 
    {
        await selection.save();
        res.status(201).json({message: "Success, Selections Updated"});   
    } 
    catch(err) 
    {
        res.status(500).json({ message: err.message })
    }
}

const getSelection = async(req,res) => {
    try 
    {
        const selections = await Selections.find({id: req.params.id})
        .sort({ createdAt: -1 })
        .limit(1)
        .select('selection');
        if(selections.length===0)
        {
            res.status(409).json({message: "Select the player first"});   
        }
        else
        {
            res.status(201).json({data:selections,message: "Your Recent Selection, Successful"}); 
        }
    } 
    catch(err) 
    {
        res.status(500).json({ message: err.message })
    }
}

const matchAdd = async(req,res) => {
    let match = new Match(req.body);
    try 
    {
        await match.save();
        res.status(201).json({message: "Success, Match Updated"});   
    } 
    catch(err) 
    {
        res.status(500).json({ message: err.message })
    }
}

const getRecentMatch = async(req,res) => {
    try 
    {
        const match = await Match.find()
        .sort({ createdAt: -1 })
        .limit(1)
        if(match.length===0)
        {
            res.status(409).json({message: "Match not started yet"});   
        }
        else
        {
            res.status(201).json({data:match,message: "Live Match"}); 
        }
    } 
    catch(err) 
    {
        res.status(500).json({ message: err.message })
    }
}

module.exports = {
    signup,
    leaderboard,
    addSelection,
    getSelection,
    matchAdd,
    getRecentMatch
} 