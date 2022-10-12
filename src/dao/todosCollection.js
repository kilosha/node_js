import DBConnection from "./index.js";
import { ObjectId } from "mongodb";

const MONGO_COLLECTION = "todos";

class TodosCollection {
    async getTodos(userID) {
        const connection = await DBConnection.getConnection();
        const db = DBConnection.connectToDB(connection);

        const todos = await db
            .collection(MONGO_COLLECTION)
            .find({ userID })
            .toArray();

        connection.close();

        todos.forEach(todos => delete Object.assign(todos, {ID: todos._id })._id);

        return todos;
    }

    async createTodo(newTodoInfo) {
        const connection = await DBConnection.getConnection();
        const db = DBConnection.connectToDB(connection);

        const user = await db
            .collection(MONGO_COLLECTION)
            .insertOne(newTodoInfo);

        connection.close();

        delete Object.assign(newTodoInfo, {ID: newTodoInfo._id })._id;
        return newTodoInfo;
    }

    async updateTodoTitle(newTitle, todoID, userID) {
        let updatedTodo;
        const connection = await DBConnection.getConnection();
        const db = DBConnection.connectToDB(connection);

        const todo = await db
            .collection(MONGO_COLLECTION)
            .findOne({ _id: ObjectId(todoID), userID });
            

        if (todo) { 
            updatedTodo = await db
                .collection(MONGO_COLLECTION)
                .updateOne({ _id: ObjectId(todoID)}, { $set: { title: newTitle } });

            delete Object.assign(todo, {ID: todo._id })._id;
        }

        connection.close();
        return updatedTodo ? { ...todo, title: newTitle } : todo;
    }

    async updateTodoStatus(todoID, userID) {
        let updatedTodo;
        const connection = await DBConnection.getConnection();
        const db = DBConnection.connectToDB(connection);

        const todo = await db
            .collection(MONGO_COLLECTION)
            .findOne({ _id: ObjectId(todoID), userID });
            
        if (todo) { 
            updatedTodo = await db
                .collection(MONGO_COLLECTION)
                .updateOne({ _id: ObjectId(todoID)}, { $set: { isCompleted: !todo.isCompleted } });

            delete Object.assign(todo, {ID: todo._id })._id;
        }

        connection.close();
        return updatedTodo ? { ...todo, isCompleted: !todo.isCompleted } : todo;
    }

    async deleteTodo(todoID, userID) {
        const connection = await DBConnection.getConnection();
        const db = DBConnection.connectToDB(connection);

        const todo = await db
            .collection(MONGO_COLLECTION)
            .findOne({ _id: ObjectId(todoID), userID });
            
        if (todo) { 
            await db
                .collection(MONGO_COLLECTION)
                .deleteOne({ _id: ObjectId(todoID)});

            delete Object.assign(todo, {ID: todo._id })._id;
        }

        connection.close();
        return todo;
    }
}

export default new TodosCollection();