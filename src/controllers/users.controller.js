import { validationResult } from "express-validator";
import Sentry from "@sentry/node";
import * as bcrypt from "bcrypt";

import User from "../models/User.js";
import UsersServices from "../services/users.service.js";
import Utils from "../utils/utils.js";

const saltRounds = 5;

class UsersControllers {
    async getUsers(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                errors: errors.array()
            });
        } else {
            try {
                let users = [];
                if (Object.values(req.query).length) {
                    users = await UsersServices.getQueryUsers(req.query);
                } else {
                    users = await UsersServices.getAllUsers();
                }
                res.send(users);
            } catch (e) {
                Sentry.captureException(e);
                res.status(400).send({ message: e.message });
            }
        }
    }

    async getUserByID(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                errors: errors.array()
            });
        } else {
            try {
                const user = await UsersServices.getUserByID(req.params.ID);
                res.send(user);
            } catch (e) {
                Sentry.captureException(e);
                res.status(400).send({ message: e.message });
            }
        }
    }

    async createUser(req, res) {
        const errors = validationResult(req);
        const isEmailAlreadyUsed = await UsersServices.checkEmailUsage(req.body.email);
        const isUserNameAlreadyUsed = await UsersServices.checkUsernameUsage(req.body.username);
        let errorsStrorage = [];

        if (isEmailAlreadyUsed || isUserNameAlreadyUsed) {
            const alreadyUsedErrors = Utils._createErrors(isUserNameAlreadyUsed, isEmailAlreadyUsed, req.body.username, req.body.email);
            errorsStrorage.push(alreadyUsedErrors);
        }
        
        if (!errors.isEmpty() || errorsStrorage.length) {
            return res.status(400).send({
                success: false,
                errors: errors.array().concat(...errorsStrorage)
            });
        } else {
            try {
                const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
                const newUser = new User(req.body, hashedPassword);
                const newDBUser = await UsersServices.createUser(newUser);
                res.send(newDBUser);
            } catch (e) {
                Sentry.captureException(e);
                res.status(400).send({ message: e.message });
            }
        }
    }

    async updateFullUser(req, res) {
        const errors = validationResult(req);
        const isEmailAlreadyUsed = await UsersServices.checkEmailUsage(req.body.email, req.params.ID);
        const isUserNameAlreadyUsed = await UsersServices.checkUsernameUsage(req.body.username, req.params.ID);
        let errorsStrorage = [];

        if (isEmailAlreadyUsed || isUserNameAlreadyUsed) {
            const alreadyUsedErrors = Utils._createErrors(isUserNameAlreadyUsed, isEmailAlreadyUsed, req.body.username, req.body.email);
            errorsStrorage.push(alreadyUsedErrors);
        }

        if (!errors.isEmpty() || errorsStrorage.length) {
            return res.status(400).send({
                success: false,
                errors: errors.array().concat(...errorsStrorage)
            });
        } else {
            try {
                if (req.user.ID !== req.params.ID) throw new Error("???????????????????????? ?????????? ???????????? ???????????? ???????? ????????????!");

                const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
                const updatedUser = await UsersServices.updateFullUser(req.params.ID, {
                    ...req.body,
                    age: Number(req.body.age),
                    password: hashedPassword
                });
                res.send(updatedUser);
            } catch (e) {
                Sentry.captureException(e);
                res.status(400).send({ message: e.message });
            }
        }
    }

    async updateUser(req, res) {
        const errors = validationResult(req);
        let errorsStrorage = [];
        let isEmailAlreadyUsed, isUserNameAlreadyUsed = false;

        if (req.body.email) {
            isEmailAlreadyUsed = await UsersServices.checkEmailUsage(req.body.email, req.params.ID);
        }

        if (req.body.username) {
            isUserNameAlreadyUsed = await UsersServices.checkUsernameUsage(req.body.username, req.params.ID);
        }

        if (isEmailAlreadyUsed || isUserNameAlreadyUsed) {
            const alreadyUsedErrors = Utils._createErrors(isUserNameAlreadyUsed, isEmailAlreadyUsed, req.body.username, req.body.email);
            errorsStrorage.push(alreadyUsedErrors);
        }

        if (!errors.isEmpty() || errorsStrorage.length) {
            return res.status(400).send({
                success: false,
                errors: errors.array().concat(...errorsStrorage)
            });
        } else {
            try {
                if (req.user.ID !== req.params.ID) throw new Error("???????????????????????? ?????????? ???????????? ???????????? ???????? ????????????!");
                
                const updatedFields = { ...req.body };
                
                if (req.body.age) {
                    updatedFields.age = Number(req.body.age);
                } 

                if (req.body.password) {
                    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
                    updatedFields.password = hashedPassword;
                }

                const updatedUser = await UsersServices.updateUser(req.params.ID, updatedFields);

                res.send(updatedUser);
            } catch (e) {
                Sentry.captureException(e);
                res.status(400).send({ message: e.message });
            }
        }
    }

    async deleteUser(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                errors: errors.array()
            });
        } else {
            try {
                if (req.user.ID !== req.params.ID) throw new Error("???????????????????????? ???? ?????????? ?????????????? ?????????????? ????????????????????????!");
                const deletedUser = await UsersServices.deleteUser(req.params.ID);
                res.send(deletedUser);
            } catch (e) {
                Sentry.captureException(e);
                res.status(400).send({ message: e.message });
            }
        }
    }

    async filterUsers(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                errors: errors.array()
            });
        } else {
            try {
                const filteredUsers = await UsersServices.filterUsers(req.params.param);
                res.send(filteredUsers);
            } catch (e) {
                Sentry.captureException(e);
                res.status(400).send({ message: e.message });
            }
        }
    }
}

export default new UsersControllers();