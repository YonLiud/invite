import { Router } from "express";
import { LikeController } from "../controllers/LikeController";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const likeController = new LikeController();

router.get("/post/:postId", (req, res) =>
  likeController.getLikesByPost(req, res),
);
router.get("/check/:postId", authMiddleware, (req, res) =>
  likeController.checkIfLiked(req, res),
);

router.post("/", authMiddleware, (req, res) =>
  likeController.likePost(req, res),
);
router.delete("/:postId", authMiddleware, (req, res) =>
  likeController.unlikePost(req, res),
);
router.get("/me", authMiddleware, (req, res) =>
  likeController.getMyLikes(req, res),
);

export default router;
