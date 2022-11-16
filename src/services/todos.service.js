import Sequelize from 'sequelize';
import model from '../models/index.js';
const { Todo } = model;

class TodosServices {
    async getTodos(userID) {
        const todos = await Todo.findAll({
            where: {user_id: userID},
            order: [
                ['id', 'ASC']
            ]
        });
        return todos;
    }

    async getQueryTodos(userID, isCompleted) {
        const todos = await Todo.findAll({
            where: {user_id: userID, isCompleted}
        });
        return todos;
    }

    async createTodo(newTodoInfo) {
        const todo =  await Todo.create(newTodoInfo);
        return todo;
    }

    async updateTodoTitle(newTitle, todoID, userID) {
        const todo = await Todo.update(
            { title: newTitle },
            { where: { id: todoID, user_id: userID}, 
            returning: true}
        );
        if (!todo[0]) throw new Error("У данного пользователя нет такой задачи");
        return todo[1];
    }

    async updateTodoStatus(todoID, userID) {
        const todo = await Todo.update(
            { isCompleted: Sequelize.literal('NOT "isCompleted"') },
            { where: { id: todoID, user_id: userID}, 
            returning: true}
        );

        if (!todo[0]) throw new Error("У данного пользователя нет такой задачи");
        return todo[1];
    }

    async deleteTodo(todoID, userID) {
        const deletedTodo = await Todo.findOne({
            where: {
                id: todoID,
                user_id: userID
            }
        });
        
        if (deletedTodo) {
            const destroyStatus = await Todo.destroy({
                where: {
                    id: todoID,
                    user_id: userID
                }
            });

            if (!destroyStatus) throw new Error('Что-то пошло не так');
            return deletedTodo; 
        } else {
            throw new Error("У данного пользователя нет такой задачи");
        }
    }
}

export default new TodosServices();