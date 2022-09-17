import { validationResult } from 'express-validator';
import Sentry from '@sentry/node';
import * as bcrypt from 'bcrypt';

import UsersServices from '../services/users.service.js';

const saltRounds = 5;

class UsersControllers {
    async getUsers(req, res) {
        let users = [];
        try {
            if (Object.values(req.query).length) {
                users = await UsersServices.getQueryUsers(req.query);
            } else {
                users = await UsersServices.getAllUsers();
            }
            res.send(users);
        } catch (e) {
            Sentry.captureException(e);
            res.status(404).send(e.message);
        }
    }

    async getUserByID(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                errors: errors.array(),
            });
        } else {
            try {
                const user = await UsersServices.getUserByID(req.params.ID);
                res.send(user);
            } catch (e) {
                Sentry.captureException(e);
                res.status(404).send(e.message);
            }
        }
    }

    async createUser(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                errors: errors.array(),
            });
        } else {
            try {
                const isEmailAlreadyUsed = await UsersServices.checkEmailUsage(req.body.email);
                if (!isEmailAlreadyUsed) {
                    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
                    const newUser = await UsersServices.createUser({
                        ...req.body,
                        password: hashedPassword
                    });
                    res.send(newUser);
                } else {
                    return res.status(400).send({
                        success: false,
                        message: "Введенный email уже используется"
                    });
                }
            } catch (e) {
                Sentry.captureException(e);
                res.status(400).send(e.message);
            }
        }
    }

    async updateFullUser(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                errors: errors.array(),
            });
        } else {
            try {
                const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
                const updatedUser = await UsersServices.updateFullUser({
                    ...req.body,
                    password: hashedPassword
                });
                res.send(updatedUser);
            } catch (e) {
                Sentry.captureException(e);
                res.status(400).send(e.message);
            }
        }
    }

    async updateUser(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                errors: errors.array(),
            });
        } else {
            try {
                let hashedPassword;
                if (req.body.password) {
                    hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
                }

                const updatedUser = await UsersServices.updateUser({
                    ...req.body,
                    password: hashedPassword || req.body.password
                });

                res.send(updatedUser);
            } catch (e) {
                Sentry.captureException(e);
                res.status(400).send(e.message);
            }
        }
    }

    async deleteUser(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                errors: errors.array(),
            });
        } else {
            try {
                const deletedUser = await UsersServices.deleteUser(req.params.ID);
                res.send(deletedUser);
            } catch (e) {
                Sentry.captureException(e);
                res.status(400).send(e.message);
            }
        }
    }

    async filterUsers(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                errors: errors.mapped(),
            });
        } else {
            try {
                const filteredUsers = await UsersServices.filterUsers(req.params.param);
                res.send(filteredUsers);
            } catch (e) {
                Sentry.captureException(e);
                res.status(404).send(e.message);
            }
        }
    }
}

export default new UsersControllers();
