import TodoModel from "../models/todo.model.js";

class TodosMongooseServices {
    async getTodos(userID) {
        const todos = await TodoModel.find({userID}).lean();
        return todos;
    }

    async getQueryTodos(userID, isCompleted) {
        const todos = await TodoModel.find({userID, isCompleted}).lean();
        return todos;
    }

    async createTodo(newTodoInfo) {
        const todo = await new TodoModel(newTodoInfo).save();
        return todo.toObject();
    }

    async updateTodoTitle(newTitle, todoID, userID) {
        const updatedTodo = await TodoModel.findOneAndUpdate({_id: todoID, userID}, {title: newTitle}, {new: true});
        if (!updatedTodo) throw new Error("У данного пользователя нет такой задачи");
        return updatedTodo.toObject();
    }

    async updateTodoStatus(todoID, userID) {
        const updatedTodo = await TodoModel.findOne({_id: todoID, userID});
        if (!updatedTodo) throw new Error("У данного пользователя нет такой задачи");
        updatedTodo.isCompleted = !updatedTodo.isCompleted;
        updatedTodo.save();
        return updatedTodo.toObject();
    }

    async deleteTodo(todoID, userID) {
        const deletedTodo = await TodoModel.findOneAndDelete({_id: todoID, userID});
        if (!deletedTodo) throw new Error("У данного пользователя нет такой задачи");
        return deletedTodo.toObject();
    }
}

export default new TodosMongooseServices();