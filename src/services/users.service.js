import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

class UsersServices {
    getAllUsers() {
        return new Promise((res, rej) => {
            fs.readFile('./users.json', 'utf8', function (err, data) {
                if (err) {
                    rej(err);
                } else {
                    res(JSON.parse(data).users);
                }
            })
        })
    }

    getQueryUsers(query) {
        return new Promise((res, rej) => {
            this
                .getAllUsers()
                .then(users => {
                    const { min, max, ...other } = { ...query };

                    // TODO : перенести в validator.js
                    if (Object.keys(other).length > 0) {
                        rej(new Error('Некорректные query параметры: ' + Object.keys(other)));
                    }

                    if (+min > +max) {
                        rej(new Error('Некорректные query параметры: min должно быть <= max'));
                    }

                    if (+min <= 10 || +min >= 100 || !min) {
                        rej(new Error('Минимальный возраст должен быть в диапазоне от 10 до 100 лет'));
                    }

                    if (+max <= 10 || +max >= 100 || !max) {
                        rej(new Error('Максимальный возраст должен быть в диапазоне от 10 до 100 лет'));
                    }

                    const queryUsers = users.filter(user => +query.min <= user.age && user.age <= +query.max);
                    if (queryUsers.length > 0) {
                        res(queryUsers);
                    } else {
                        rej(new Error("Пользователи не найдены"));
                    }
                })
        })
    }

    getUserByID(ID) {
        return new Promise((res, rej) => {
            this
                .getAllUsers()
                .then(users => {
                    const user = users.find(user => user.ID === ID);
                    if (user) {
                        res(user);
                    } else {
                        rej(new Error(`Пользователь с ID ${ID} не найден`));
                    }
                })
        })
    }

    createUser(userInfo) {
        const newUserID = uuidv4();
        const newUser = { ID: newUserID, ...userInfo };

        return new Promise((res, rej) => {
            this
                .getAllUsers()
                .then(users => {
                    users.push(newUser);
                    this._updateFile(users);
                    res(newUser);
                })
        })
    }

    updateFullUser(params) {
        return new Promise((res, rej) => {
            this
                .getAllUsers()
                .then(users => {
                    const userIndex = users.findIndex(user => user.ID === params.ID);

                    if (userIndex >= 0) {
                        users[userIndex] = { ID: users[userIndex].ID, ...params };

                        this._updateFile(users);
                        res(users[userIndex]);
                    } else {
                        rej(new Error(`Пользователь с ID ${params.ID} не найден`));
                    }
                })
        })
    }

    updateUser(params) {
        return new Promise((res, rej) => {
            this
                .getAllUsers()
                .then(users => {
                    const userIndex = users.findIndex(user => user.ID === params.ID);

                    if (userIndex >= 0) {
                        users[userIndex] = { ...users[userIndex], ...params };

                        this._updateFile(users);
                        res(users[userIndex]);
                    } else {
                        rej(new Error(`Пользователь с ID ${params.ID} не найден`));
                    }
                })
        })
    }

    deleteUser(ID) {
        return new Promise((res, rej) => {
            this
                .getAllUsers()
                .then(users => {
                    const userIndex = users.findIndex(user => user.ID === ID);
                    if (userIndex !== -1) {
                        const deletedUser = users.splice(userIndex, 1)[0];

                        this._updateFile(users);
                        res(deletedUser);
                    } else {
                        rej(new Error(`Пользователь с ID ${ID} не найден`));
                    }
                })
        })
    }

    filterUsers(param) {
        return new Promise((res, rej) => {
            this
                .getAllUsers()
                .then(users => {
                    if (param === 'M') {
                        res(users.filter(user => user.isMan));
                    } else if (param === 'F') {
                        res(users.filter(user => !user.isMan));
                    } else {
                        const user = users.find(user => user.ID === param);
                        if (user) {
                            res(user);
                        } else {
                            rej(new Error(`Пользователь с ID ${param} не найден`));
                        }
                    }
                })
        })
    }

    _updateFile(users) {
        fs.writeFile('./users.json', JSON.stringify({ users }, null, 3), (err) => {
            if (err) {
                throw err;
            }
        })
    }

    checkEmailUsage(email, ID) {
        return new Promise((res, rej) => {
            this
                .getAllUsers()
                .then(users => {
                    if (ID) {
                        users = users.filter(user => user.ID !== ID);
                    }
                    const user = users.find(user => user.email === email);
                    if (user) {
                        res(true);
                    } else {
                        res(false);
                    }
                })
        })
    }

    checkUsernameUsage(username, ID) {
        return new Promise((res, rej) => {
            this
                .getAllUsers()
                .then(users => {
                    if (ID) {
                        users = users.filter(user => user.ID !== ID);
                    }
                    const user = users.find(user => user.username === username);
                    if (user) {
                        res(true);
                    } else {
                        res(false);
                    }
                })
        })
    }
}

export default new UsersServices;