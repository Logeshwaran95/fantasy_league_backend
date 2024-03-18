const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BattingStatsSchema = new Schema({
  id: { type: String, required: true },
  player: { type: String, required: true },
  runs: { type: Number, required: true },
  balls: { type: Number, required: true },
  fours: { type: Number, required: true },
  sixes: { type: Number, required: true },
  strikeRate: { type: Number, required: true },
});

const BowlingStatsSchema = new Schema({
  id: { type: String, required: true },
  player: { type: String, required: true },
  overs: { type: Number, required: true },
  maidens: { type: Number, required: true },
  runs_: { type: Number, required: true },
  wickets: { type: Number, required: true },
  economy: { type: Number, required: true },
});

const FallOfWicketsSchema = new Schema({
  playerName: { type: String, required: true },
  wicket: { type: Number, required: true },
  runs: { type: Number, required: true },
});

const MatchSchema = new Schema({
  id: { type: String, required: true },
  team1: { type: String, required: true },
  team2: { type: String, required: true },
  toss: { type: String, required: true },
  stadium: { type: String, required: true },
  commentary: {type: String, required: true},
  battingFirst: {type: String, required: true},
  bowlingFirst: {type: String, required: true},
  team1flag: {type: String, required: true},
  team2flag: {type: String, required: true},
  totalRunsTeam1: { type: String, required: true },
  totalRunsTeam2: { type: String, required: true },
  result: { type: String, required: true },
  battingTeam1: { type: [BattingStatsSchema], required: true },
  bowlingTeam1: { type: [BowlingStatsSchema], required: true },
  extrasTeam1: { type: Number, required: true },
  fallOfWicketsTeam1: { type: [FallOfWicketsSchema], required: true },
  battingTeam2: { type: [BattingStatsSchema], required: true },
  bowlingTeam2: { type: [BowlingStatsSchema], required: true },
  extrasTeam2: { type: Number, required: true },
  fallOfWicketsTeam2: { type: [FallOfWicketsSchema], required: true },
}, { timestamps: true });

const Match = mongoose.model('Matchs', MatchSchema);

module.exports = Match;
