import express from "express";
import { createMatch, updateScore, getMatches, getMatchById } from "../controllers/MatchController.js";


const router = express.Router();

router.post('/matches', createMatch);
router.patch('/matches/:id', updateScore);
router.get('/matches', getMatches);
router.get('/matches/:id', getMatchById);



export default router;