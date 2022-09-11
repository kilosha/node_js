import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { validate as uuidValidate } from 'uuid';

class UsersServices {
    getAllUsers() {
        return new Promise((res, rej) => {
            fs.readFile('./src/services/users.json', 'utf8', function(err,data) {
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
                const queryUsers = users.filter( user => +query.min <= user.age && user.age <= +query.max);
                if (queryUsers.length > 0) {
                    res(queryUsers);
                } else {
                    rej(new Error("Пользователи не найдены"));
                }
            })
        })
    }

    getUserByID(ID) {
        if (!uuidValidate(ID)) throw new Error('Некорректный ID');
        
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
        const newUser = {ID: newUserID, ...userInfo};

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

    updateFullUser(ID, params){
        if (!uuidValidate(ID)) throw new Error('Некорректный ID');

        return new Promise((res, rej) => {
            this
            .getAllUsers()
            .then(users => {
                const userIndex = users.findIndex( user => user.ID === ID);

                if (userIndex >= 0) {
                    users[userIndex] = { ...users[userIndex], ...params};

                    this._updateFile(users);
                    res(users[userIndex]);
                } else {
                    rej(new Error(`Пользователь с ID ${ID} не найден`));
                } 
            })      
        })
    }

    updateUser(ID, params) {
        if (!uuidValidate(ID)) throw new Error('Некорректный ID');

        return new Promise((res, rej) => {
            this
            .getAllUsers()
            .then(users => {
            const userIndex = users.findIndex( user => user.ID === ID);

            if (userIndex >= 0) {
                if (params.age) {
                    users[userIndex].age = +params.age;
                } if (params.name) {
                    users[userIndex].name = params.name;
                } if (params.isMan !== undefined) {
                    users[userIndex].isMan = params.isMan;
                }

                this._updateFile(users);
                res(users[userIndex]);

            } else {
                rej(new Error(`Пользователь с ID ${ID} не найден`));
            }})
        })
    }

    deleteUser(ID) {
        if (!uuidValidate(ID)) throw new Error('Некорректный ID');

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
        return new Promise((res,rej) => {
            this
            .getAllUsers()
            .then(users => {
                if (param === 'M') {
                    res(users.filter(user => user.isMan));
                } else if (param === 'F') {
                    res(users.filter(user => !user.isMan));
                } else {
                    if (!uuidValidate(param)) rej(new Error('Некорректный ID'));

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
        fs.writeFile('./src/services/users.json', JSON.stringify({users}, null, 3), (err) => {
            if (err) {
                throw err;
            }
        })
    }
}

export default new UsersServices;