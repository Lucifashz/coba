import express from "express";
import { 
   createPartner,  getPartners,
   getPartnersByReceiverId, getPartnersBySenderId,
   updatePartnerByReceiver, updatePartnerBySender,
   updatePartnerStatusByReceiver
} from "../controllers/PartnerController.js";


const router = express.Router();

router.post('/partner', createPartner);
router.get('/partners', getPartners);
router.get('/partners-by-receiver-id/:id', getPartnersByReceiverId);
router.get('/partners-by-sender-id/:id', getPartnersBySenderId);
router.patch('/partners-by-receiver-id/:id', updatePartnerByReceiver);
router.patch('/partners-by-sender-id/:id', updatePartnerBySender);
router.patch('/partners-partner-status/:id', updatePartnerStatusByReceiver);

export default router;