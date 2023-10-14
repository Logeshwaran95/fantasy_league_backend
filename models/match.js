const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BattingStatsSchema = new Schema({
  id: { type: Number, required: true },
  player: { type: String, required: true },
  runs: { type: Number, required: true },
  balls: { type: Number, required: true },
  fours: { type: Number, required: true },
  sixes: { type: Number, required: true },
  strikeRate: { type: Number, required: true },
});

const BowlingStatsSchema = new Schema({
  id: { type: Number, required: true },
  bowler: { type: String, required: true },
  overs: { type: Number, required: true },
  maidens: { type: Number, required: true },
  runs: { type: Number, required: true },
  wickets: { type: Number, required: true },
  economy: { type: Number, required: true },
});

const FallOfWicketsSchema = new Schema({
  name: { type: String, required: true },
  wicket: { type: Number, required: true },
  runs: { type: Number, required: true },
});

const MatchSchema = new Schema({
  teams: {
    team1: { type: String, required: true },
    team2: { type: String, required: true },
  },
  score: { type: String, required: true },
  toss: { type: String, required: true },
  electedTo: { type: String, required: true },
  stadium: { type: String, required: true },
  batting: { type: String, required: true },
  bowling: { type: String, required: true },
  onStrike: { type: String, required: true },
  nonStrike: { type: String, required: true },
  bowler: { type: String, required: true },
  battingStats: { type: [BattingStatsSchema], required: true },
  bowlingStats: { type: [BowlingStatsSchema], required: true },
  extras: {
    byes: { type: Number, required: true },
    wides: { type: Number, required: true },
    noBalls: { type: Number, required: true },
  },
  fallOfWickets: { type: [FallOfWicketsSchema], required: true },
}, { timestamps: true });

const Match = mongoose.model('Matchs', MatchSchema);

module.exports = Match;
