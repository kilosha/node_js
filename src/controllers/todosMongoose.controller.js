import { validationResult } from "express-validator";
import Sentry from "@sentry/node";

import TodosMongooseServices from "../services/todosMongoose.service.js";
import Todo from "../models/Todo.js";

class TodosMongooseControllers {
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
                    todos = await TodosMongooseServices.getQueryTodos(req.user.ID, req.query);
                } else {
                    todos = await TodosMongooseServices.getTodos(req.user.ID);
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
                const newTodo = new Todo(req.body.title, req.user.ID);
                const newDBTodo = await TodosMongooseServices.createTodo(newTodo);
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
                const updatedTodo = await TodosMongooseServices.updateTodoTitle(req.body.title, req.params.ID, req.user.ID);
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
                errors: errors.array()
            });
        } else {
            try {
                const updatedTodo = await TodosMongooseServices.updateTodoStatus(req.params.ID, req.user.ID);
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
                const deletedTodo = await TodosMongooseServices.deleteTodo(req.params.ID, req.user.ID);
                res.send(deletedTodo);
            } catch (e) {
                Sentry.captureException(e);
                res.status(400).send({ message: e.message });
            }
        }
    }
}

export default new TodosMongooseControllers();