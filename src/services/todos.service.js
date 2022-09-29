import fs from "fs";
import { v4 as uuidv4 } from "uuid";

class TodosServices {
    getTodos(userID) {
        return new Promise((res, rej) => {
            this._getAllTodos().then(todos => {
                const userTodos = todos.filter(todo => todo.user_ID === userID);
                res(userTodos);
            }).catch(err => {
                rej(err);
            });
        })
    }

    _getAllTodos() {
        return new Promise((res, rej) => {
            fs.readFile("./todos.json", "utf8", function (err, data) {
                if (err) {
                    rej(err);
                } else {
                    const allTodos = JSON.parse(data).todos;
                    if (allTodos && allTodos.length > 0) {
                        res(JSON.parse(data).todos);
                    }
                    rej(new Error("Что-то пошло не так"));
                }
            })
        })
    }

    createTodo(newTodoInfo) {
        const newTodoID = uuidv4();
        const newTodo = { ID: newTodoID, ...newTodoInfo };

        return new Promise((res, rej) => {
            this
                ._getAllTodos()
                .then(todos => {
                    todos.push(newTodo);
                    this._updateFile(todos);
                    res(newTodo);
                }).catch(err => {
                    rej(err);
                });
        })
    }

    updateTodoTitle(newTitle, todoID, userID) {
        return new Promise((res, rej) => {
            this._getAllTodos().then(todos => {
                const currentTodo = todos.find(todo => todo.user_ID === userID && todo.ID === todoID);
                if (currentTodo) {
                    currentTodo.title = newTitle;
                    this._updateFile(todos);
                    res(currentTodo);
                } else {
                    rej(new Error("У данного пользователя нет такой задачи"));
                }
            }).catch(err => {
                rej(err);
            });
        })
    }

    updateTodoStatus(todoID, userID) {
        return new Promise((res, rej) => {
            this._getAllTodos().then(todos => {
                const currentTodo = todos.find(todo => todo.user_ID === userID && todo.ID === todoID);
                if (currentTodo) {
                    currentTodo.isCompleted = !currentTodo.isCompleted;
                    this._updateFile(todos);
                    res(currentTodo);
                } else {
                    rej(new Error("У данного пользователя нет такой задачи"));
                }
            }).catch(err => {
                rej(err);
            });
        })
    }

    deleteTodo(todoID, userID) {
        return new Promise((res, rej) => {
            this._getAllTodos().then(todos => {
                const currentTodoIndex = todos.findIndex(todo => todo.user_ID === userID && todo.ID === todoID);
                if (currentTodoIndex !== -1) {
                    const deletedTodo = todos[currentTodoIndex];
                    todos.splice(currentTodoIndex, 1);
                    this._updateFile(todos);
                    res(deletedTodo);
                } else {
                    rej(new Error("У данного пользователя нет такой задачи"));
                }
            }).catch(err => {
                rej(err);
            });
        })
    }

    _updateFile(todos) {
        fs.writeFile("./todos.json", JSON.stringify({ todos }, null, 3), (err) => {
            if (err) {
                throw err;
            }
        })
    }
}

export default new TodosServices();