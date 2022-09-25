import { validationResult } from 'express-validator';
import Sentry from '@sentry/node';

import TodosServices from '../services/todos.service.js';

class TodosControllers {
    async getTodos(req, res) {
        try {
            const todos = await TodosServices.getTodos(req.user.ID);
            res.send(todos);
        } catch (e) {
            Sentry.captureException(e);
            res.status(404).send(e.message);
        }
    }

    async createTodo(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                errors: errors.array(),
            });
        } else {
            try {
                const newTodoInfo = {...req.body, isCompleted: false, user_ID: req.user.ID}
                const newTodo = await TodosServices.createTodo(newTodoInfo);
                res.send(newTodo);
            } catch (e) {
                Sentry.captureException(e);
                res.status(400).send(e.message);
            }
        }
    }

    async updateTodoTitle(req, res) { 
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                errors: errors.array(),
            });
        } else {
            try {
                const updatedTodo = await TodosServices.updateTodoTitle(req.body.title, req.params.ID, req.user.ID);
                res.send(updatedTodo);
            } catch (e) {
                Sentry.captureException(e);
                res.status(400).send(e.message);
            }
        }
    }


    async updateTodoStatus(req, res) { 
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                errors: errors.array(),
            });
        } else {
            try {
                const updatedTodo = await TodosServices.updateTodoStatus(req.params.ID, req.user.ID);
                res.send(updatedTodo);
            } catch (e) {
                Sentry.captureException(e);
                res.status(400).send(e.message);
            }
        }
    }  

    async deleteTodo(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                errors: errors.array(),
            });
        } else {
            try {
                const deletedTodo = await TodosServices.deleteTodo(req.params.ID, req.user.ID);
                res.send(deletedTodo);
            } catch (e) {
                Sentry.captureException(e);
                res.status(400).send(e.message);
            }
        }
    }
}

export default new TodosControllers();