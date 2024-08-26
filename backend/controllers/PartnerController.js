import Partner from "../models/PartnerModel.js";


export const createPartner = async (req, res) => {
   await Partner.create({
      sender: {
         id: req.body["sender"]
      },
      receiver: {
         id: req.body["receiver"]
      }
   })
   .then((result) => {
      res.status(201).json(result)
   })
   .catch((error) => {
      res.status(404).json({message: error.message});
   })
}

export const getPartners = async (req, res) => {
   await Partner.find()
   .then((result) => {
      res.json(result);
   })
   .catch((error) => {
      res.status(500).json({message: error.message});
   });
}

export const getPartnersByReceiverId = async (req, res) => {
   await Partner.find({"receiver.id": req.params.id})
   .then((result) => {
      res.json(result);
   })
   .catch((error) => {
      res.status(500).json({message: error.message});
   });
}

export const getPartnersBySenderId = async (req, res) => {
   await Partner.find({"sender.id": req.params.id})
   .then((result) => {
      res.json(result);
   })
   .catch((error) => {
      res.status(500).json({message: error.message});
   });
}

export const updatePartnerByReceiver = async (req, res) => {
   await Partner.updateOne({_id: req.params.id}, 
      {
         $set: {
            "receiver.notificationStatus": req.body["partner-status"]
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

export const updatePartnerBySender = async (req, res) => {
   await Partner.updateOne({_id: req.params.id}, 
      {
         $set: {
            "sender.notificationStatus": req.body["partner-status"]
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

export const updatePartnerStatusByReceiver = async (req, res) => {
   await Partner.updateOne({_id: req.params.id}, 
      {
         $set: {
            "sender.notificationStatus": req.body["notification-status"],
            "receiver.notificationStatus": req.body["notification-status"],
            partnerStatus: req.body["partner-status"]
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
