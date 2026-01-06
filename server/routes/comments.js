import express from 'express'

import { postComment, getComment, deleteComment, editComment, likeComment, dislikeComment } from '../controllers/comments.js'
import { verifyToken } from '../middleware/auth.js'
const router = express.Router()


router.post('/post', verifyToken, postComment)
router.get('/get', getComment)
router.delete('/delete/:id', verifyToken, deleteComment)
router.patch('/edit/:id', verifyToken, editComment)
router.patch('/like/:id', verifyToken, likeComment)
router.patch('/dislike/:id', verifyToken, dislikeComment)

export default router