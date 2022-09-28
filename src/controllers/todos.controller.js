import { validationResult } from 'express-validator';
import Sentry from '@sentry/node';

import TodosServices from '../services/todos.service.js';
import Todo from '../models/Todo.js';

class TodosControllers {
    async getTodos(req, res) {
        try {
            const todos = await TodosServices.getTodos(req.user.ID);
            res.send(todos);
        } catch (e) {
            Sentry.captureException(e);
            res.status(404).send({ message: e.message });
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
                const newTodo = new Todo(req.body.title, req.user.ID);
                const newDBTodo = await TodosServices.createTodo(newTodo);
                res.send(newDBTodo);
            } catch (e) {
                Sentry.captureException(e);
                res.status(400).send({ message: e.message });
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
                res.status(400).send({ message: e.message });
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
                res.status(400).send({ message: e.message });
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
                res.status(400).send({ message: e.message });
            }
        }
    }
}

export default new TodosControllers();