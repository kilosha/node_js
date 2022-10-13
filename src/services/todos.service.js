import TodosCollection from '../dao/todosCollection.js';

class TodosServices {
    async getTodos(userID) {
        const todos = await TodosCollection.getTodos(userID);
        return todos;
    }

    async getQueryTodos(userID, isCompleted) {
        const todos = await TodosCollection.getQueryTodos(userID, isCompleted);
        return todos;
    }

    async createTodo(newTodoInfo) {
        const todo = await TodosCollection.createTodo(newTodoInfo);
        return todo;
    }

    async updateTodoTitle(newTitle, todoID, userID) {
        const todo = await TodosCollection.updateTodoTitle(newTitle, todoID, userID);
        if (!todo) throw new Error("У данного пользователя нет такой задачи");
        return todo;
    }

    async updateTodoStatus(todoID, userID) {
        const todo = await TodosCollection.updateTodoStatus(todoID, userID);
        if (!todo) throw new Error("У данного пользователя нет такой задачи");
        return todo;
    }

    async deleteTodo(todoID, userID) {
        const todo = await TodosCollection.deleteTodo(todoID, userID);
        if (!todo) throw new Error("У данного пользователя нет такой задачи");
        return todo;
    }
}

export default new TodosServices();