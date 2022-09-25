import express from 'express';
import usersRoutes from './users.routes.js';
import authRoutes from './auth.routes.js';
import todosRoutes from './todos.routes.js';

const router = express.Router();

router.use('/users', usersRoutes);
router.use('/auth', authRoutes);
router.use('/todos', todosRoutes);

export default router;