import express from "express";
import UsersControllers from "../controllers/users.controller.js";
import Validator from "../utils/validator.js";
import authenticateToken from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *  get:
 *      summary: Get all users or users filtered by age range if query exists
 *      description: Returns users array
 *      tags:
 *          - Users
 *      parameters:
 *        - in: query
 *          name: min
 *          required: false
 *          description: Set an min age of users to get (from 10 to 100)
 *          type: integer
 *        - in: query
 *          name: max
 *          required: false
 *          description: Set an max age of users to get (from 10 to 100)
 *          type: integer
 *      responses:
 *        200:
 *          description: Successful response
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items: 
 *                  $ref: "#/components/schemas/User"
 *        400:
 *          description: Bad request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties: 
 *                  success:
 *                    type: boolean
 *                    example: false
 *                  errors:
 *                    type: array
 *                    items:
 *                      type: object                 
 *                      properties:
 *                        value:
 *                          type: string
 *                          example: 3
 *                        msg:
 *                          type: string
 *                          example: Минимальный возраст должен быть целым числом от 10 до 100
 *                        param:
 *                          type: string
 *                          example: min
 *                        location:
 *                          type: string
 *                          example: query
 */
router.get("/", Validator.validateQueryIfPresent(), UsersControllers.getUsers);

/**
 * @swagger
 * /api/users/user/{ID}:
 *  get:
 *      summary: Get user by {ID}
 *      description: Returns user object with ID
 *      tags:
 *          - Users
 *      parameters:
 *        - in: path
 *          name: ID
 *          required: true
 *          description: Set an {ID} of a user to get
 *          type: string
 *          example: d28e6dd0-a5ce-4c2c-8790-2ba0980007da
 *      responses:
 *        200:
 *          description: Successful response
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/User"
 *        400:
 *          description: Bad request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties: 
 *                  success:
 *                    type: boolean
 *                    example: false
 *                  errors:
 *                    type: array
 *                    items:
 *                      type: object                 
 *                      properties:
 *                        value:
 *                          type: string
 *                          example: d2ba09800587da
 *                        msg:
 *                          type: string
 *                          example: ID должен быть в формате UUID
 *                        param:
 *                          type: string
 *                          example: ID
 *                        location:
 *                          type: string
 *                          example: params
 */
router.get("/user/:ID", Validator.validateID(), UsersControllers.getUserByID);

/**
 * @swagger
 * /api/users/{param}:
 *  get:
 *      summary: Get filtered users by isMan or get user by ID
 *      description: Returns users array or user with ID
 *      tags:
 *          - Users
 *      parameters:
 *        - in: path
 *          name: param
 *          required: true
 *          description: If "M" or "F" get array of users with isMan true or false, if ID - return user with this ID
 *          type: string
 *          example: "M"
 *      responses:
 *        200:
 *          description: Successful response
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items: 
 *                  $ref: "#/components/schemas/User"
 *        400:
 *          description: Bad request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties: 
 *                  success:
 *                    type: boolean
 *                    example: false
 *                  errors:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties: 
 *                        msg:
 *                          type: string
 *                          example: Фильтр возможен только по F, M или UUID
 *                        param:
 *                          type: string
 *                          example: _error
 *                        nestedErrors:
 *                          type: array
 *                          items: 
 *                            type: object                 
 *                            properties:
 *                              value:
 *                                type: string
 *                              msg:
 *                                type: string
 *                              param:
 *                                type: string
 *                              location:
 *                                type: string
 *                          example:
 *                            - value: d2ba09800587da
 *                              msg: Допустимы значения F или M
 *                              param: param
 *                              location: params           
 *                            - value: d2ba09800587da
 *                              msg: ID должен быть в формате UUID
 *                              param: param
 *                              location: params           
 */
router.get("/:param", Validator.validateFilter(), UsersControllers.filterUsers);

/**
 * @swagger
 *  /api/users/register:
 *    post:
 *      summary: Add new user and return new user object with ID if success
 *      description:
 *          Register "User" object.
 *      tags:
 *          - Users
 *          - Registration
 *      requestBody:
 *        $ref: "#/components/requestBodies/User"
 *      responses:
 *        200:
 *          description: Successful response
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/User"
 *        400:
 *          description: Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties: 
 *                  success:
 *                    type: boolean
 *                    example: false
 *                  message:
 *                    type: string
 *                    example: "Введенный email уже используется"
 * components:
 *   requestBodies:
 *     User:
 *       description: Users object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Masha
 *                 description: Users' name
 *               username:
 *                 type: string
 *                 example: marry22
 *                 description: Username
 *               email:
 *                 type: string
 *                 example: example@example.com
 *                 description: Users' email
 *               password: 
 *                 type: string
 *                 example: 1Sq_22qw
 *                 description: Users' password (min length - 8 symbols, min 1 uppercase, min 1 lowercase, min 1 number, min 1 symbol) 
 *               isMan:
 *                 type: boolean
 *                 example: false
 *                 description: Man or woman
 *               age:
 *                 type: integer
 *                 example: 25
 *                 description: Users' age
 *             required:
 *               - name
 *               - username
 *               - email
 *               - password
 *               - isMan
 *               - age
 *   schemas:
 *     User:
 *       description: Users object
 *       properties:
 *         ID:
 *           type: string
 *           example: d28e6dd0-a5ce-4c2c-8790-2ba0980007da
 *         name:
 *           type: string
 *           example: Masha
 *         username:
 *           type: string
 *           example: marry22
 *         email:
 *           type: string
 *           example: example@example.com
 *         password:
 *           type: string
 *           example: $2b$05$N3D9QDUXCp3N7cjNJyfi9uHwzx862bgvEhx03Krwh54VXyOPUIJcm
 *         isMan:
 *           type: boolean
 *           example: false
 *         age:
 *           type: integer
 *           example: 25
 *       required:
 *         - ID
 *         - name
 *         - username
 *         - email
 *         - password
 *         - isMan
 *         - age
 */
router.post("/register", Validator.validateUser(), UsersControllers.createUser);

/**
 * @swagger
 * /api/users/{ID}:
 *  put:
 *      summary: Updates a user with {ID}
 *      tags:
 *        - Users
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: ID
 *          required: true
 *          description: Set an {ID} of a user to update
 *          type: string
 *          example: d28e6dd0-a5ce-4c2c-8790-2ba0980007da
 *      requestBody:
 *        $ref: "#/components/requestBodies/User"
 *      responses:
 *        200:
 *          description: Successful response
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/User"
 *        400:
 *          $ref: "#/components/responses/ValidationError"
 */
router.put("/:ID", [Validator.validateID(), Validator.validateUser()], UsersControllers.updateFullUser);

/**
 * @swagger
 * /api/users/{ID}:
 *  patch:
 *      summary: Updates a user with {ID}
 *      tags:
 *        - Users
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: ID
 *          required: true
 *          description: Set an {ID} of a user to update
 *          type: string
 *          example: d28e6dd0-a5ce-4c2c-8790-2ba0980007da
 *      requestBody:
 *        $ref: "#/components/requestBodies/UserPropertiesForUpdate"
 *      responses:
 *        200:
 *          description: Successful response
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/User"
 *        400:
 *          $ref: "#/components/responses/ValidationError"
 * components:
 *   requestBodies:
 *     UserPropertiesForUpdate:
 *       description: User properties which were edited.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Masha
 *                 description: Users' name
 *               username:
 *                 type: string
 *                 example: marry22
 *                 description: Username
 *               email:
 *                 type: string
 *                 example: example@example.com
 *                 description: Users' email
 *               password: 
 *                 type: string
 *                 example: 1Sq_22qw
 *                 description: Users' password (min length - 8 symbols, min 1 uppercase, min 1 lowercase, min 1 number, min 1 symbol) 
 *               isMan:
 *                 type: boolean
 *                 example: false
 *                 description: Man or woman
 *               age:
 *                 type: integer
 *                 example: 25
 *                 description: Users' age
 *   responses:
 *     ValidationError:
 *       description: Bad request
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: 
 *               success:
 *                 type: boolean
 *                 example: false
 *               errors:
 *                 type: array
 *                 items:
 *                   type: object                 
 *                   properties:
 *                         value:
 *                           type: string
 *                           example: masha8.com
 *                         msg:
 *                           type: string
 *                           example: Укажите корректный email (example@example.com)
 *                         param:
 *                           type: string
 *                           example: email
 *                         location:
 *                           type: string
 *                           example: body
 *     UserNotFound: 
 *       description: Cannot find user
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: 
 *               message:
 *                 type: string
 *                 example: "Пользователь с ID 3c2af1c7-2bb9-4b33-b425-77f5a7d1d12a не найден"      
 */
router.patch("/:ID", [Validator.validateID(), Validator.validateUserUpdate()], UsersControllers.updateUser);

/**
 * @swagger
 * /api/users/{ID}:
 *  delete:
 *      summary: Delete user with {ID}
 *      tags:
 *        - Users
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: ID
 *          required: true
 *          description: ID of user to delete
 *          type: string
 *          example: d28e6dd0-a5ce-4c2c-8790-2ba0980007da
 *      responses:
 *        200:
 *          description: Successful response
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/User"
 *        400:
 *          $ref: "#/components/responses/UserNotFound"
 */
router.delete("/:ID", Validator.validateID(), UsersControllers.deleteUser);

export default router;