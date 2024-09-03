import mongoose from "mongoose";

// Membuat Schema
const teamSchema = new mongoose.Schema({
   playerOneId: { type: String, required: true },
   playerTwoId: { type: String },
   score: { type: Number, default: 0 },
}, { _id: false });

const matchSchema = new mongoose.Schema({
   teamOne: { type: teamSchema, required: true },
   teamTwo: { type: teamSchema, required: true },
   status: { 
      type: String, 
      enum: { 
         values: ["unfinished", "finished"],
      },
      default: "unfinished"
   },
   winner: {
      type: String,
      default: "none",
      validate: {
         validator: function(value) {
         return value === "none" || value === "teamOne" || value === "teamTwo";
         },
         message: props => `${props.value} is not a valid winner!`
      }
   }
}, { _id: false });

const matchesSchema = new mongoose.Schema({
   refereeId: { type: String, required: true },
   matchOne: { type: matchSchema, required: true },
   matchTwo: {
      type: matchSchema,
      required: false,
   },
   matchThree: {
      type: matchSchema,
      required: false,
   },
   matchType: { type: String, required: true },
   matchDate: { type: Date, required: true },
   matchWinner: {
      type: String,
      default: "none",
      validate: {
         validator: function(value) {
         return value === "none" || value === "teamOne" || value === "teamTwo";
         },
         message: props => `${props.value} is not a valid match winner!`
      }
   }
}, { timestamps: true });

function determineWinner(teamOneScore, teamTwoScore, status) {
   if (teamOneScore > teamTwoScore && status === "finished") {
      return "teamOne";
   } else if (teamTwoScore > teamOneScore && status === "finished") {
      return "teamTwo";
   } else {
      return "none";
   }
}

function createMatch(matchOne, existingMatch) {
   if (!existingMatch) {
      return {
         teamOne: {
            playerOneId: matchOne.teamOne.playerOneId,
            playerTwoId: matchOne.teamOne.playerTwoId || undefined,
         },
         teamTwo: {
            playerOneId: matchOne.teamTwo.playerOneId,
            playerTwoId: matchOne.teamTwo.playerTwoId || undefined,
         },
      };
   }
   return existingMatch;
}

matchesSchema.pre('save', function(next) {
   this.matchOne.winner = determineWinner(this.matchOne.teamOne.score, this.matchOne.teamTwo.score, this.matchOne.status);

   if (this.matchTwo) {
      this.matchTwo.winner = determineWinner(this.matchTwo.teamOne.score, this.matchTwo.teamTwo.score, this.matchTwo.status);
   }

   if (this.matchThree) {
      this.matchThree.winner = determineWinner(this.matchThree.teamOne.score, this.matchThree.teamTwo.score, this.matchThree.status);
   }

   if (this.matchOne.winner === "none") {
      this.matchTwo = undefined;
      this.matchThree = undefined;
   } else {
      this.matchTwo = createMatch(this.matchOne, this.matchTwo);
   }

   if (this.matchTwo && this.matchOne.winner === this.matchTwo.winner) {
      this.matchThree = undefined;
   } else if (this.matchTwo && this.matchTwo.status === "finished" && this.matchOne.winner !== this.matchTwo.winner) {
      this.matchThree = createMatch(this.matchTwo, this.matchThree);
   }

   const winners = [this.matchOne.winner, this.matchTwo?.winner, this.matchThree?.winner];
   const teamOneWins = winners.filter(w => w === "teamOne").length;
   const teamTwoWins = winners.filter(w => w === "teamTwo").length;

   this.matchWinner = determineOverallWinner(teamOneWins, teamTwoWins);
   next();
});

function determineOverallWinner(teamOneWins, teamTwoWins) {
   if (teamOneWins > 1) {
      return "teamOne";
   } else if (teamTwoWins > 1) {
      return "teamTwo";
   } else {
      return "none";
   }
}



const Match = mongoose.model('Match', matchesSchema);

export default Match;