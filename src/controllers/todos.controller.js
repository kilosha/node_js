import { validationResult } from "express-validator";
import Sentry from "@sentry/node";

import TodosServices from "../services/todos.service.js";

class TodosControllers {
    async getTodos(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                errors: errors.array()
            });
        } else {
            try {
                let todos;
                if (Object.values(req.query).length) {
                    todos = await TodosServices.getQueryTodos(req.user.id, req.query.isCompleted);
                } else {
                    todos = await TodosServices.getTodos(req.user.id);
                }

                res.send(todos);
            } catch (e) {
                Sentry.captureException(e);
                res.status(400).send({ message: e.message });
            }
        }
    }

    async createTodo(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                errors: errors.array()
            });
        } else {
            try {
                const newTodo = { title: req.body.title, user_id: req.user.id };
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
                errors: errors.array()
            });
        } else {
            try {
                const updatedTodo = await TodosServices.updateTodoTitle(req.body.title, req.params.id, req.user.id);
                res.send(...updatedTodo);
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
                errors: errors.array()
            });
        } else {
            try {
                const updatedTodo = await TodosServices.updateTodoStatus(req.params.id, req.user.id);
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
                errors: errors.array()
            });
        } else {
            try {
                const deletedTodo = await TodosServices.deleteTodo(req.params.id, req.user.id);
                res.send(deletedTodo);
            } catch (e) {
                Sentry.captureException(e);
                res.status(400).send({ message: e.message });
            }
        }
    }
}

export default new TodosControllers();