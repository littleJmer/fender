import express from 'express';
import { authenticate } from '../middleware/authenticate.js';

import authController from '../controller/authController.js';
import userController from '../controller/userController.js';

const router = express.Router();

router.get("/", function (req, res, next) {
    return res.json({ dd: new Date() });
});

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/refresh-token", authController.refreshToken);

router.use(authenticate);

router.post("/signout", authController.signout);

router.get("/user", userController.get);
router.put("/user", userController.update);
router.delete("/user", userController.delete);

export default router;	