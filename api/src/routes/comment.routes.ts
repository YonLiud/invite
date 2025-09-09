import { Router } from 'express';
import { CommentController } from '../controllers/CommentController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const commentController = new CommentController();

router.get('/post/:postId', (req, res) => commentController.getCommentsByPost(req, res));
router.get('/:id', (req, res) => commentController.getComment(req, res));

router.post('/', authMiddleware, (req, res) => commentController.createComment(req, res));
router.put('/:id', authMiddleware, (req, res) => commentController.updateComment(req, res));
router.delete('/:id', authMiddleware, (req, res) => commentController.deleteComment(req, res));

export default router;