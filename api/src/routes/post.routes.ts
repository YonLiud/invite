import { Router } from "express";
import { PostController } from "../controllers/PostController";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const postController = new PostController();

router.get("/:id", (req, res) => postController.getPostById(req, res));
router.get("/", authMiddleware, (req, res) =>
  postController.getAllPosts(req, res),
);
router.get("/user/:username", authMiddleware, (req, res) =>
  postController.getPostsByAuthor(req, res),
);
router.post("/", authMiddleware, (req, res) =>
  postController.createPost(req, res),
);
router.delete("/:id", authMiddleware, (req, res) =>
  postController.deletePost(req, res),
);
router.put("/:id", authMiddleware, (req, res) =>
  postController.updatePost(req, res),
);

export default router;
