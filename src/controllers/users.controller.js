import { validationResult } from "express-validator";
import Sentry from "@sentry/node";
import * as bcrypt from "bcrypt";

import User from "../models/User.js";
import UsersServices from "../services/users.service.js";

const saltRounds = 5;

class UsersControllers {
    async getUsers(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                errors: errors.array(),
            });
        } else {
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
                const isUserNameAlreadyUsed = await UsersServices.checkUsernameUsage(req.body.username);
                if (!isEmailAlreadyUsed && !isUserNameAlreadyUsed) {
                    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
                    const newUser = new User(req.body, hashedPassword);
                    const newDBUser = await UsersServices.createUser(newUser);
                    res.send(newDBUser);
                } else {   
                    return res.status(400).send({
                        success: false,
                        message: this._createErrorMessage(isUserNameAlreadyUsed, isEmailAlreadyUsed)
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
                const isEmailAlreadyUsed = await UsersServices.checkEmailUsage(req.body.email, req.params.ID);
                const isUserNameAlreadyUsed = await UsersServices.checkUsernameUsage(req.body.username, req.params.ID);

                if (!isEmailAlreadyUsed && !isUserNameAlreadyUsed) {
                    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
                    const updatedUser = await UsersServices.updateFullUser({
                        ...req.body,
                        password: hashedPassword
                    });
                    res.send(updatedUser);
                } else {
                    return res.status(400).send({
                        success: false,
                        message: this._createErrorMessage(isUserNameAlreadyUsed, isEmailAlreadyUsed)
                    });
                }
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
                let isEmailAlreadyUsed, isUserNameAlreadyUsed = false;
                if (req.body.email) {
                    isEmailAlreadyUsed = await UsersServices.checkEmailUsage(req.body.email, req.params.ID);
                }

                if (req.body.username) {
                    isUserNameAlreadyUsed = await UsersServices.checkUsernameUsage(req.body.username, req.params.ID);
                }
                
                if (!isEmailAlreadyUsed && !isUserNameAlreadyUsed) {
                    const updatedFields = {...req.body};

                    if (req.body.password) {
                        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
                        updatedFields.password = hashedPassword;
                    }

                    const updatedUser = await UsersServices.updateUser(updatedFields);

                    res.send(updatedUser);
                } else {
                    return res.status(400).send({
                        success: false,
                        message: this._createErrorMessage(isUserNameAlreadyUsed, isEmailAlreadyUsed)
                    });
                }
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

    _createErrorMessage(isUserNameAlreadyUsed, isEmailAlreadyUsed) {
        let message;
        if (!isUserNameAlreadyUsed) {
            message = "Введенный email уже используется";
        } else if (!isEmailAlreadyUsed) {
            message = "Введенный username уже используется";
        } else {
            message = "Введенныe username и email уже используются";
        }

        return message;
    }
}

export default new UsersControllers();