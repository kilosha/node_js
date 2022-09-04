import { Router } from "express";
import peopleRoutes from "./people.routes.js";
import messagesRoutes from "./messages.routes.js";

const router = Router();

router.use('/people', peopleRoutes);
router.use('/messages', messagesRoutes);

export default router;