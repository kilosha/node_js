import TodoModel from "../models/todo.model.js";

class TodosMongooseServices {
    async getTodos(userID) {
        const todos = await TodoModel.find({userID}).lean();
        return todos;
    }

    async getQueryTodos(userID, query) {
        let todos;
        if (query.limit || query.page) {
            let count;
            const { page = 1, limit = 10 } = query;

            if (query.isCompleted !== undefined ) {
                todos = await TodoModel.find({userID, isCompleted: query.isCompleted})
                            .limit(limit * 1)
                            .skip((page - 1) * limit)
                            .lean();

                count = await TodoModel.countDocuments({userID, isCompleted: query.isCompleted});
            } else {
                todos = await TodoModel.find({userID})
                    .limit(limit * 1)
                    .skip((page - 1) * limit)
                    .lean();
                    
                count = await TodoModel.countDocuments({userID});
            
            }
            return {
                todos, 
                totalPages: Math.ceil(count / limit),
                currentPage: page};

        } else {
            todos = await TodoModel.find({userID, isCompleted: query.isCompleted}).lean();
            return todos;
        }
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