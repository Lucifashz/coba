import Match from "../models/MatchModel.js";


export const createMatch = async (req, res) => {
   await Match.create(req.body)
   .then((response) => { 
      res.status(201).send(response);
   })
   .catch((error) => { 
      res.status(400).send({ error: error.message });
   })
}

export const getMatches = async (req, res) => {
   try {
      const matches = await Match.find();
      res.json(matches);
   } catch (error) {
      res.status(500).json({message: error.message});
   }
}

export const getMatchById = async (req, res) => {
   try {
      const match = await Match.findById(req.params.id);
      res.json(match);
   } catch (error) {
      res.status(404).json({message: error.message});
   }
}

export const updateScore = async (req, res) => {
   try {
      const { id } = req.params;
      const { match, teamOne, teamTwo, status } = req.body;

      // Validate the match type and ensure it exists in the request body
      if (match && ['matchOne', 'matchTwo', 'matchThree'].includes(match)) {
         const updateOperation = {};

         // Dynamically construct the update operation with safety checks
         if (teamOne && typeof teamOne.score !== 'undefined') {
            updateOperation[`${match}.teamOne.score`] = teamOne.score;
         }
         if (teamTwo && typeof teamTwo.score !== 'undefined') {
            updateOperation[`${match}.teamTwo.score`] = teamTwo.score;
         }
         if (typeof status !== 'undefined') {
            updateOperation[`${match}.status`] = status;
         }

         // Apply the update
         const result = await Match.updateOne({ _id: id }, { $set: updateOperation });

         if (result.nModified === 0) {
            return res.status(404).send({ error: 'Match not found or no changes made' });
         }

         // Fetch the updated Match to apply middleware logic
         const updatedMatch = await Match.findById(id);
         await updatedMatch.save(); // This will trigger the pre-save middleware

         return res.status(200).send(updatedMatch);
      } else {
         return res.status(400).send({ error: 'Invalid match type or missing match type in request body' });
      }
   } catch (error) {
      return res.status(500).send({ error: error.message });
   }
};