import Challenge from "../models/ChallengeModel.js";
import User from "../models/UserModel.js";


export const createChallenge = async (req, res) => {
   const challenger = await User.findById(req.body["challenger"]);
   const challenged = await User.findById(req.body["challenged"]);

   if (req.body["matchType"] === "double") {
      if (challenger.partnerId !== "" && challenged.partnerId !== "" ) {
         await Challenge.create({
            challenger: {
               id: req.body["challenger"],
               partnerId: req.body["challengerPartner"]
            },
            challenged: {
               id: req.body["challenged"],
               partnerId: req.body["challengedPartner"]
            },
            matchReferee: req.body["matchReferee"],
            matchType: req.body["matchType"],
            matchDate: req.body["matchDate"]
         })
         .then((result) => {
            res.status(201).json(result)
         })
         .catch((error) => {
            res.status(404).json({message: error.message});
         })
      } else {
         return res.status(400).json({ messageError: "Player ini atau Kamu belum punya partner, tidak bisa pertandingan ganda" });
      }
   } else if (req.body["matchType"] === "single") {
         await Challenge.create({
            challenger: {
               id: req.body["challenger"]
            },
            challenged: {
               id: req.body["challenged"]
            },
            matchReferee: req.body["matchReferee"],
            matchType: req.body["matchType"],
            matchDate: req.body["matchDate"]
         })
         .then((result) => {
            res.status(201).json(result)
         })
         .catch((error) => {
            res.status(404).json({message: error.message});
         })
   }
}


export const getChallanges = async (req, res) => {
   await Challenge.find()
   .then((result) => {
      res.json(result);
   })
   .catch((error) => {
      res.status(500).json({message: error.message});
   });
}

export const getChallangesByChallengedId = async (req, res) => {
   await Challenge.find({"challenged.id": req.params.id})
   .then((result) => {
      res.json(result);
   })
   .catch((error) => {
      res.status(500).json({message: error.message});
   });
}

export const getChallangesByChallengerId = async (req, res) => {
   await Challenge.find({"challenger.id": req.params.id})
   .then((result) => {
      res.json(result);
   })
   .catch((error) => {
      res.status(500).json({message: error.message});
   });
}

export const updateChallengeByChallanged = async (req, res) => {
   await Challenge.updateOne({_id: req.params.id}, 
      {
         $set: {
            "challenged.notificationStatus": req.body["notification-status"]
         }
      }
   )
   .then((result) => {
      res.status(200).json(result)
   })
   .catch((error) => {
      res.status(404).json({message: error.message});
   })
}

export const updateChallengeByChallanger = async (req, res) => {
   await Challenge.updateOne({_id: req.params.id}, 
      {
         $set: {
            "challenger.notificationStatus": req.body["notification-status"]
         }
      }
   )
   .then((result) => {
      res.status(200).json(result)
   })
   .catch((error) => {
      res.status(404).json({message: error.message});
   })
}

export const updateChallengeMatchStatusByChallanged = async (req, res) => {
   await Challenge.updateOne({_id: req.params.id}, 
      {
         $set: {
            "challenger.notificationStatus": req.body["notification-status"],
            "challenged.notificationStatus": req.body["notification-status"],
            matchStatus: req.body["match-status"]
         }
      }
   )
   .then((result) => {
      res.status(200).json(result)
   })
   .catch((error) => {
      res.status(404).json({message: error.message});
   })
}
