import express from "express";
import { getUsers, getUserById, register, login, logout, addPartner, deletePartner } from "../controllers/UsersController.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshTokenController.js";

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.patch('/add-partner/:id', addPartner);
router.patch('/delete-partner/:id', deletePartner);
router.post('/register', register);
router.post('/login', login);
router.delete('/logout', logout);
router.get('/token', refreshToken);

export default router;