import express from "express";
import { 
   createChallenge, getChallanges, isPlayerHasPartner, 
   getChallangesByChallengedId, getChallangesByChallengerId,
   updateChallengeByChallanged, updateChallengeByChallanger,
   updateChallengeMatchStatusByChallanged
} from "../controllers/ChallengeController.js";


const router = express.Router();

router.post('/challenge', createChallenge);
router.post('/challenge-check-double', isPlayerHasPartner);
router.get('/challenges', getChallanges);
router.get('/challenges-by-challenged-id/:id', getChallangesByChallengedId);
router.get('/challenges-by-challenger-id/:id', getChallangesByChallengerId);
router.patch('/challenges-by-challenged-id/:id', updateChallengeByChallanged);
router.patch('/challenges-by-challenger-id/:id', updateChallengeByChallanger);
router.patch('/challenges-match-status/:id', updateChallengeMatchStatusByChallanged);

export default router;