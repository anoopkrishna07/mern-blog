import express from 'express';
import { create, getPosts } from '../controllers/post.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyUser, create);
router.get('/getposts', getPosts);

export default router;