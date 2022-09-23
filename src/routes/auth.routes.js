import express from "express";
import AuthControllers from "../controllers/auth.controller.js";
import Validator from "../utils/validator.js";

const router = express.Router();

/**
 * @swagger
 *  /api/auth/login:
 *    post:
 *      summary: Checks if such user exist in system, checks password and return JWT token if everything is OK
 *      description:
 *          Check email and password correctness
 *      tags:
 *          - Login
 *      parameters:
 *        - name: log info
 *          in: body
 *          description: Users' email and password
 *          required: true
 *          schema:
 *            $ref: '#/definitions/LogInfo'
 *      responses:
 *        200:
 *          description: Successful response
 *          schema:
 *            $ref: '#/definitions/TokenObject'
 *            title: Return token
 *        400:
 *          description: Error
 *          schema:
 *            type: string
 *            example: "Такого пользователя нет!"
 * definitions:
 *   LogInfo:
 *     description: Users' email and password
 *     properties:
 *       email:
 *         type: string
 *         example: vlad8@mail.ru
 *         description: Users' email
 *       password: 
 *         type: string
 *         example: Hello_34
 *         description: Users' password (min length - 8 symbols, min 1 uppercase, min 1 lowercase, min 1 number, min 1 symbol) 
 *     required:
 *      - email
 *      - password
 *   TokenObject:
 *     description: Token
 *     properties:
 *       token:
 *         type: string
 *         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZsYWQ4QG1haWwucnUiLCJpYXQiOjE2NjM5MjczOTZ9.3t7XJh3E8v5Va_ngMaIAmY6kqTbkpRbjHzQiF4xoOo0"
 *         description: Token
 */
router.post('/login', Validator.validateLogin(), AuthControllers.login);

export default router;