import express from "express";
import usersRoutes from "./users.routes.js";
import authRoutes from "./auth.routes.js";
import todosRoutes from "./todos.routes.js";
import usersMongooseRoutes from "./usersMongoose.routes.js";
import authMongooseRoutes from "./authMongoose.routes.js";
//import todosMongooseRoutes from "./todosMongoose.routes.js";

const router = express.Router();

router.use("/users", usersRoutes);
router.use("/auth", authRoutes);
router.use("/todos", todosRoutes);
router.use("/mongoose/users", usersMongooseRoutes);
router.use("/mongoose/auth", authMongooseRoutes);
//router.use("/mongoose/todos", todosMongooseRoutes);

export default router;