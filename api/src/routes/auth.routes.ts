import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const authController = new AuthController();

router.post("/register", (req, res) => authController.register(req, res));
router.post("/login", (req, res) => authController.login(req, res));
router.post("/refresh", (req, res) => authController.refresh(req, res));
router.post("/logout", authMiddleware, (req, res) =>
    authController.logout(req, res),
);
router.post("/logoutAll", authMiddleware, (req, res) =>
    authController.logoutAllSessions(req, res),
);

router.get("/me", authMiddleware, (req, res) => {
    res.json({
        success: true,
        user: {
            id: req.user?.id,
            username: req.user?.username,
            display_name: req.user?.display_name,
        },
    });
});

export default router;
