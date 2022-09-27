import express from 'express';
import authenticateToken from '../middleware/auth.js';
import TodosControllers from "../controllers/todos.controller.js";
import Validator from "../utils/validator.js";

const router = express.Router();

/**
 * @swagger
 * /api/todos:
 *  get:
 *      security: 
 *        - bearerAuth: []
 *      summary: Get all tasks of current user
 *      description: Returns tasks array
 *      tags:
 *          - Todos
 *      responses:
 *           200:
 *              description: Successful response
 *              content:
 *                application/json:
 *                  schema: 
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/TodoItem'     
 *           401:
 *             $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', authenticateToken, TodosControllers.getTodos);

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
 *        $ref: '#/components/requestBodies/TodoTitle'
 *      responses:
 *        200:
 *          description: Successful response
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/TodoItem'            
 *        401:
 *          $ref: '#/components/responses/UnauthorizedError'
 * components:
 *   schemas: 
 *     TodoItem:
 *       description: Todos' object
 *       properties:
 *         ID:
 *           type: string
 *           example: 410bed16-5f00-44f8-aa33-d1f27bd4db13
 *           description: Todos' ID
 *         title:
 *           type: string
 *           example: Купить гвозди
 *           description: Title
 *         isCompleted:
 *           type: boolean
 *           example: false
 *           description: Default value false. Is todo completed or not.
 *         user_ID:
 *           type: string
 *           example: ff1be2bb-d160-40d0-8bbc-68a830a7dc60
 *           description: ID of user, which todo it is.
 *       required:
 *         - ID
 *         - title
 *         - isCompleted
 *         - user_ID   
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
 *         text/plain:
 *           schema:
 *             type: string
 *             example: "Для работы нужен токен!"
 */
router.post('/', authenticateToken, Validator.validateTodoTitle(), TodosControllers.createTodo);

/**
 * @swagger
 * /api/todos/{ID}:
 *  patch:
 *      summary: Updates todo title for todo with ID = {ID}
 *      tags:
 *        - Todos
 *      security: 
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: ID
 *          required: true
 *          description: Set an {ID} of a todo to update
 *          type: string
 *          example: f465260c-3096-4069-9a30-0ad03bed7ca0
 *      requestBody:
 *        $ref: '#/components/requestBodies/TodoTitle'
 *      responses:
 *           200:
 *              description: Successful response with updated Todo
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/components/schemas/TodoItem'      
 *           401:
 *             $ref: '#/components/responses/UnauthorizedError'
 */
router.patch('/:ID', authenticateToken, [Validator.validateID(), Validator.validateTodoTitle()], TodosControllers.updateTodoTitle);

/**
 * @swagger
 * /api/todos/isCompleted/{ID}:
 *  patch:
 *      summary: Updates isCompleted property value to the opposite for todo with ID = {ID}
 *      tags:
 *        - Todos
 *      security: 
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: ID
 *          required: true
 *          description: Set an {ID} of a todo to update
 *          type: string
 *          example: f465260c-3096-4069-9a30-0ad03bed7ca0
 *      responses:
 *           200:
 *              description: Successful response with updated Todo
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/components/schemas/TodoItem'      
 *           401:
 *             $ref: '#/components/responses/UnauthorizedError'
 */
router.patch('/isCompleted/:ID', authenticateToken, Validator.validateID(), TodosControllers.updateTodoStatus);

/**
 * @swagger
 * /api/todos/{ID}:
 *  delete:
 *      summary: Delete todo with {ID} and return deleted object if success
 *      tags:
 *        - Todos
 *      security: 
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: ID
 *          required: true
 *          description: Set an {ID} of a todo to update
 *          type: string
 *          example: f465260c-3096-4069-9a30-0ad03bed7ca0
 *      responses:
 *           200:
 *              description: Successful response with updated Todo
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/components/schemas/TodoItem'      
 *           401:
 *             $ref: '#/components/responses/UnauthorizedError'
 */
router.delete('/:ID', authenticateToken, Validator.validateID(), TodosControllers.deleteTodo);


// ДОБАВИТЬ БОЛЬШЕ СТАТУСОВ С ОШИБКАМИ

export default router;