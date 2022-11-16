import express from "express";
import authenticateToken from "../middleware/auth.js";
import TodosControllers from "../controllers/todos.controller.js";
import Validator from "../utils/validator.js";

const router = express.Router();

/**
 * @swagger
 * /api/todos:
 *  get:
 *      security: 
 *        - bearerAuth: []
 *      summary: Get all tasks of current user or filtered by isCompleted tasks (if query exists)
 *      description: Returns tasks array
 *      tags:
 *          - Todos
 *      parameters:
 *        - in: query
 *          name: isCompleted
 *          required: false
 *          description: Filter task by completeness (true or false)
 *          type: boolean
 *      responses:
 *        200:
 *          description: Successful response
 *          content:
 *            application/json:
 *              schema: 
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/TodoItem"     
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 */
router.get("/", authenticateToken, Validator.validateTodoQueryIfPresent(), TodosControllers.getTodos);

/**
 * @swagger
 *  /api/todos:
 *    post:
 *      security: 
 *      - bearerAuth: []
 *      summary: Create a new todo for current user and return Todos object
 *      description:
 *          Create a new todo for current user and return Todos object
 *      tags:
 *          - Todos
 *      requestBody:
 *        $ref: "#/components/requestBodies/TodoTitle"
 *      responses:
 *        200:
 *          description: Successful response
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/TodoItem"
 *        400:
 *          $ref: "#/components/responses/BodyContentError"             
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 * components:
 *   schemas: 
 *     TodoItem:
 *       description: Todos object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *           description: Todos id
 *         title:
 *           type: string
 *           example: Купить гвозди
 *           description: Title
 *         isCompleted:
 *           type: boolean
 *           example: false
 *           description: Default value false. Is todo completed or not.
 *         user_id:
 *           type: integer
 *           example: 1
 *           description: id of user, which todo it is.
 *       required:
 *         - id
 *         - title
 *         - isCompleted
 *         - user_id   
 *   requestBodies: 
 *     TodoTitle:
 *       description: Title for new todo.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Купить гвозди
 *   responses:
 *     UnauthorizedError:
 *       description: Unauthorized Error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Для работы нужен токен!
 *     BodyContentError:
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
 *                    type: object                 
 *                    properties:
 *                      msg:
 *                        type: string
 *                        example: Title должно быть строкой
 *                      param:
 *                        type: string
 *                        example: title
 *                      location:
 *                        type: string
 *                        example: body
 *     TodoNotFind:
 *       description: Bad request
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: У данного пользователя нет такой задачи   
 */
router.post("/", authenticateToken, Validator.validateTodoTitle(), TodosControllers.createTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *  patch:
 *      summary: Updates todo title for todo with id = {id}
 *      tags:
 *        - Todos
 *      security: 
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: Set an {id} of a todo to update
 *          type: integer
 *          example: 1
 *      requestBody:
 *        $ref: "#/components/requestBodies/TodoTitle"
 *      responses:
 *           200:
 *              description: Successful response with updated Todo
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: "#/components/schemas/TodoItem"
 *           400:
 *             $ref: "#/components/responses/BodyContentError"     
 *           401:
 *             $ref: "#/components/responses/UnauthorizedError"
 */
router.patch("/:id", authenticateToken, [Validator.validateID(), Validator.validateTodoTitle()], TodosControllers.updateTodoTitle);

/**
 * @swagger
 * /api/todos/{id}/isCompleted:
 *  patch:
 *      summary: Updates isCompleted property value to the opposite for todo with id = {id}
 *      tags:
 *        - Todos
 *      security: 
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: Set an {id} of a todo to update
 *          type: integer
 *          example: 1
 *      responses:
 *        200:
 *          description: Successful response with updated Todo
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/TodoItem"      
 *        400:
 *          $ref: "#/components/responses/TodoNotFind"                  
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 */
router.patch("/:id/isCompleted", authenticateToken, Validator.validateID(), TodosControllers.updateTodoStatus);

/**
 * @swagger
 * /api/todos/{id}:
 *  delete:
 *      summary: Delete todo with {id} and return deleted object if success
 *      tags:
 *        - Todos
 *      security: 
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: Set an {id} of a todo to update
 *          type: integer
 *          example: 1
 *      responses:
 *        200:
 *          description: Successful response with updated Todo
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/TodoItem"      
 *        400:
 *          $ref: "#/components/responses/TodoNotFind"                  
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 */
router.delete("/:id", authenticateToken, Validator.validateID(), TodosControllers.deleteTodo);

export default router;