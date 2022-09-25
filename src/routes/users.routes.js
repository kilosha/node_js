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
 *      security:
 *           - bearerAuth: []
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
 *           200:
 *              description: Successful response
 *              schema:
 *                type: array
 *                items: 
 *                  $ref: '#/definitions/UserWithID'
 *           404:
 *              description: Error
 *              schema:
 *                type: string
 *                example: "Пользователи не найдены"
 *  components:
 *  securitySchemes:
 *   bearerAuth:            # arbitrary name for the security scheme
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT  
 */
router.get('/', authenticateToken, UsersControllers.getUsers);

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
 *           200:
 *              description: Successful response
 *              schema:
 *                $ref: '#/definitions/UserWithID'
 *           404:
 *              description: Error
 *              schema:
 *                type: string
 *                example: "Пользователь с ID 3c2af1c7-2bb9-4b33-b485-77f5a7d1d12a не найден"
 */
router.get('/user/:ID', Validator.validateID(), UsersControllers.getUserByID);

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
 *          description: If 'M' or 'F' get array of users with isMan true or false, if ID - return user with this ID
 *          type: string
 *      responses:
 *           200:
 *              description: Successful response
 *              schema:
 *                oneOf:
 *                  - $ref: '#/definitions/UpdateUser'
 *                  - $ref: '#/definitions/Users'
 *           400:
 *              description: Error
 *              schema:
 *                type: string
 *                example: "Пользователь с ID 3c2af1c7-2bb9-4b33-b485-77f5a7d1d12a не найден"
 */
router.get('/:param', Validator.validateFilter(), UsersControllers.filterUsers);

/**
 * @swagger
 *  /api/users:
 *    post:
 *      summary: Add new user and return new user object with ID if success
 *      description:
 *          Register 'User' object.
 *      tags:
 *          - Users
 *      parameters:
 *        - name: user
 *          in: body
 *          description: user object
 *          required: true
 *          schema:
 *            $ref: '#/definitions/Users'
 *      responses:
 *        200:
 *          description: Successful response
 *          schema:
 *            $ref: '#/definitions/UserWithID'
 *        400:
 *          description: Error
 *          schema:
 *            type: string
 *            example: "Не заполнено обязательное поле username"
 * definitions:
 *   Users:
 *     description: Users object
 *     properties:
 *       name:
 *         type: string
 *         example: Masha
 *         description: Users' name
 *       username:
 *         type: string
 *         example: marry22
 *         description: Username
 *       email:
 *         type: string
 *         example: example@example.com
 *         description: Users' email
 *       password: 
 *         type: string
 *         example: 1Sq_22qw
 *         description: Users' password (min length - 8 symbols, min 1 uppercase, min 1 lowercase, min 1 number, min 1 symbol) 
 *       isMan:
 *         type: boolean
 *         example: false
 *         description: Man or woman
 *       age:
 *         type: integer
 *         example: 25
 *         description: Users' age
 *     required:
 *      - name
 *      - username
 *      - email
 *      - password
 *      - isMan
 *      - age
 *   UpdateUser:
 *     description: User with properties which should be updated
 *     properties:
 *       name:
 *         type: string
 *         example: Masha
 *         description: Users' name
 *       username:
 *         type: string
 *         example: marry22
 *         description: Username
 *       email:
 *         type: string
 *         example: example@example.com
 *         description: Users' email
 *       password: 
 *         type: string
 *         example: 1Sq_22qw
 *         description: Users' password (min length - 8 symbols, min 1 uppercase, min 1 lowercase, min 1 number, min 1 symbol) 
 *       isMan:
 *         type: boolean
 *         example: false
 *         description: Man or woman
 *       age:
 *         type: integer
 *         example: 25
 *         description: Users' age
 *   UserWithID:
 *     description: Users object
 *     properties:
 *       ID:
 *         type: string
 *         example: d28e6dd0-a5ce-4c2c-8790-2ba0980007da
 *       name:
 *         type: string
 *         example: Masha
 *       username:
 *         type: string
 *         example: marry22
 *       email:
 *         type: string
 *         example: example@example.com
 *       password:
 *         type: string
 *         example: $2b$05$N3D9QDUXCp3N7cjNJyfi9uHwzx862bgvEhx03Krwh54VXyOPUIJcm
 *       isMan:
 *         type: boolean
 *         example: false
 *       age:
 *         type: integer
 *         example: 25
 */
router.post("/", Validator.validateUser(), UsersControllers.createUser);

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
 *        - in: body
 *          name: Users
 *          required: true
 *          description: Object to update
 *          schema:
 *              $ref: '#/definitions/Users'
 *      responses:
 *           200:
 *              description: Successful response
 *              schema:
 *                $ref: '#/definitions/UserWithID'
 *           400:
 *              description: Error
 *              schema:
 *                type: string
 *                example: "Укажите корректный email (example@example.com)"
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
 *        - in: body
 *          name: Users
 *          required: true
 *          description: Object to update
 *          schema:
 *              $ref: '#/definitions/UpdateUser'
 *      responses:
 *           200:
 *              description: Successful response
 *              schema:
 *                $ref: '#/definitions/UserWithID'
 *           400:
 *              description: Error
 *              schema:
 *                type: string
 *                example: "Укажите корректный email (example@example.com)"
 */
router.patch('/:ID', [Validator.validateID(), Validator.validateUserUpdate()], UsersControllers.updateUser);

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
 *           200:
 *              description: Successful response
 *              schema:
 *                $ref: '#/definitions/UserWithID'
 *           400:
 *              description: Error
 *              schema:
 *                type: string
 *                example: "Пользователь с ID 3c2af1c7-2bb9-4b33-b485-77f5a7d1d12a не найден"
 */
router.delete('/:ID', Validator.validateID(), UsersControllers.deleteUser);

export default router;