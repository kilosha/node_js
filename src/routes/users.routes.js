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
 *          name: gender
 *          required: false
 *          description: Select all males or females
 *          type: string
 *      responses:
 *        200:
 *          description: Successful response
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items: 
 *                  $ref: "#/components/responses/User"
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
 *                          example: test
 *                        msg:
 *                          type: string
 *                          example: Пол должен быть male or female
 *                        param:
 *                          type: string
 *                          example: gender
 *                        location:
 *                          type: string
 *                          example: query
 */
router.get("/", Validator.validateQueryIfPresent(), UsersControllers.getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *  get:
 *      summary: Get user by {id}
 *      description: Returns user object with id
 *      tags:
 *          - Users
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: Set an {id} of a user to get
 *          type: integer
 *          example: 1
 *      responses:
 *        200:
 *          description: Successful response
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/responses/User"
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
 *                          example: id должен быть целым числом от 1
 *                        param:
 *                          type: string
 *                          example: id
 *                        location:
 *                          type: string
 *                          example: params
 */
router.get("/:id",  Validator.validateID(), UsersControllers.getUserByID);

/**
 * @swagger
 *  /api/users/register:
 *    post:
 *      summary: Add new user and return new user object with id if success
 *      description:
 *          Register "User" object.
 *      tags:
 *          - Users
 *      requestBody:
 *        $ref: "#/components/requestBodies/User"
 *      responses:
 *        200:
 *          description: Successful response
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/responses/User"
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
 *               gender:
 *                 type: string
 *                 example: female
 *                 description: Male or female
 *               age:
 *                 type: integer
 *                 example: 25
 *                 description: Users' age
 *             required:
 *               - username
 *               - email
 *               - password
 *               - gender
 *               - age
 *   schemas:
 *     User:
 *       description: Users object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         username:
 *           type: string
 *           example: marry22
 *         email:
 *           type: string
 *           example: example@example.com
 *         password:
 *           type: string
 *           example: 1Sq_22qw
 *         gender:
 *           type: string
 *           example: female
 *         age:
 *           type: integer
 *           example: 25
 *       required:
 *         - id
 *         - username
 *         - email
 *         - password
 *         - gender
 *         - age
 */
router.post("/register", Validator.validateUser(), UsersControllers.createUser);

/**
 * @swagger
 * /api/users/{id}:
 *  put:
 *      summary: Updates a user with {id}
 *      tags:
 *        - Users
 *      security: 
 *        - bearerAuth: []
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: Set an {id} of a user to update
 *          type: integer
 *          example: 1
 *      requestBody:
 *        $ref: "#/components/requestBodies/User"
 *      responses:
 *        200:
 *          description: Successful response
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/responses/User"
 *        400:
 *          $ref: "#/components/responses/ValidationError"
 */
 router.put("/:id", authenticateToken, [Validator.validateID(), Validator.validateUser()], UsersControllers.updateFullUser);

 /**
  * @swagger
  * /api/users/{id}:
  *  patch:
  *      summary: Updates a user with {id}
  *      tags:
  *        - Users
  *      security: 
  *        - bearerAuth: []
  *      consumes:
  *        - application/json
  *      parameters:
  *        - in: path
  *          name: id
  *          required: true
  *          description: Set an {id} of a user to update
  *          type: integer
  *          example: 1
  *      requestBody:
  *        $ref: "#/components/requestBodies/UserPropertiesForUpdate"
  *      responses:
  *        200:
  *          description: Successful response
  *          content:
  *            application/json:
  *              schema:
  *                $ref: "#/components/responses/User"
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
 *               gender:
 *                 type: string
 *                 example: female
 *                 description: Male or female
 *               age:
 *                 type: integer
 *                 example: 25
 *                 description: Users' age
 *   responses:
 *     User:
 *       description: User object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         username:
 *           type: string
 *           example: marry22
 *         email:
 *           type: string
 *           example: example@example.com
 *         age:
 *           type: integer
 *           example: 25
 *         gender:
 *           type: string
 *           example: female
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
 *                 example: "Пользователь не может удалить другого пользователя!"    
 */
router.patch("/:id", authenticateToken, [Validator.validateID(), Validator.validateUserUpdate()], UsersControllers.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *  delete:
 *      summary: Delete user with {id}
 *      tags:
 *        - Users
 *      security: 
 *        - bearerAuth: []
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: id of user to delete
 *          type: integer
 *          example: 1
 *      responses:
 *        200:
 *          description: Successful response
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/responses/User"
 *        400:
 *          $ref: "#/components/responses/UserNotFound"
 */
router.delete("/:id", authenticateToken, Validator.validateID(), UsersControllers.deleteUser);

export default router;