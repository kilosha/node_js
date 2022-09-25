import express from 'express';
import authenticateToken from '../middleware/auth.js';
import TodosControllers from "../controllers/todos.controller.js";
import Validator from "../utils/validator.js";

const router = express.Router();

/**
 * @swagger
 * /api/todos:
 *  get:
 *      summary: Get all tasks of current user
 *      description: Returns tasks array
 *      tags:
 *          - Todos
 */
router.get('/', authenticateToken, TodosControllers.getTodos);


// POST /todo
// Создать новый таск. Таск привязывается к конкретному пользователю.
// - task {
// id:string (UUID) - назначается автоматически
// title: string;
// isCompleted : boolean;
// idUser:string (UUID)
// }

/**
 * @swagger
 *  /api/todos:
 *    post:
 *      summary: Create a new todo for current user and return Todos object
 *      description:
 *          Create a new todo for current user and return Todos object
 *      tags:
 *          - Todos
 *      parameters:
 *        - name: Todo title
 *          in: body
 *          description: Todo title object
 *          required: true
 *          schema:
 *            $ref: '#/definitions/TodoTitle'
 *      responses:
 *        200:
 *          description: Successful response
 *          schema:
 *            $ref: '#/definitions/Todo'            
 *        400:
 *          description: Error
 *          schema:
 *            type: string
 *            example: "Не заполнено обязательное поле title"
 * definitions:
 *   TodoTitle:
 *     description: Todo title
 *     properties:
 *       title:
 *         type: string
 *         example: Купить гвозди
 *         description: Title
 *     required:
 *      - title
 *   Todo:
 *     description: Todos' object
 *     properties:
 *       ID:
 *         type: string
 *         example: 410bed16-5f00-44f8-aa33-d1f27bd4db13
 *         description: Todos' ID
 *       title:
 *         type: string
 *         example: Купить гвозди
 *         description: Title
 *       isCompleted:
 *         type: boolean
 *         example: false
 *         description: Default value false. Is todo completed or not.
 *       user_ID:
 *         type: string
 *         example: ff1be2bb-d160-40d0-8bbc-68a830a7dc60
 *         description: ID of user, which todo it is.
 *     required:
 *      - ID
 *      - title
 *      - isCompleted
 *      - user_ID
 */
router.post('/', authenticateToken, Validator.validateTodoTitle(), TodosControllers.createTodo);



/*
//проверять, что у этого пользователя есть такая таска
PATCH /todo/:id
Изменить title таска по id.*/
router.patch('/:ID', authenticateToken, [Validator.validateID(), Validator.validateTodoTitle()], TodosControllers.updateTodoTitle);

/*
//проверять, что у этого пользователя есть такая таска
PATCH /todo/isCompleted/:id
Изменить isCompleted таска по id на противоположный.\*/
router.patch('/isCompleted/:ID', authenticateToken, Validator.validateID(), TodosControllers.updateTodoStatus);

/*
//проверять, что у этого пользователя есть такая таска
DELETE /todo/:id
Удалить таск по id
*/
router.delete('/:ID', authenticateToken, Validator.validateID(), TodosControllers.deleteTodo);

export default router;