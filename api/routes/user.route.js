import express from 'express';
import { test, updateuser, deleteuser } from '../controllers/user.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyUser, updateuser);
router.delete('/delete/:userId', verifyUser, deleteuser);

export default router;