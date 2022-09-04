const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.listen(process.env.PORT, () => { console.log(`Now server is listening on port ${process.env.PORT}`)});

const users = [
    {id: 1, name: "Pasha", isMan: true, age: 25},
    {id: 2, name: "Sasha", isMan: true, age: 18},
    {id: 3, name: "Masha", isMan: false, age: 25},
    {id: 4, name: "Alina", isMan: false, age: 21},
    {id: 5, name: "Vova", isMan: true, age: 30}
]

// 1 GET /users => array of all users && // 7 GET /users?min=18&max=50 
// Способ 1:

app.get('/users', (req, res) => {
    if (Object.values(req.query).length) {
        res.send(users.filter( user => +req.query.min <= user.age && user.age <= +req.query.max))
    } else {
        res.send(users);
    }
})

// Cпособ 2: 
/*
    app.get(
        '/users',
        function (req, res, next) {
        if (Object.values(req.query).length) next('route');
        else next();
        },
        function (req, res) {
        console.log('Regular route');
        res.send(users);
        }
    );
  
    app.get('/users', (req, res) => {
        console.log('Special route');
        res.send(users.filter((user) => +req.query.min <= user.age && user.age <= +req.query.max));
    });
*/

/* 2 POST /user добавляет нового пользователя в массив и возвращает его */

app.post("/user", (req, res) => {
    const newUserId = users[users.length-1].id + 1;
    const newUser = {...req.body, id: newUserId}
    users.push(newUser);
    res.send(newUser);
})


// 3 PUT /user/:id изменяет всего пользователя по id и возвращает измененного юзера
app.put("/user/:id", (req, res) => {
    const userIndex = users.findIndex( user => user.id === +req.params.id);
    users[userIndex] = { ...users[userIndex], ...req.body};
    res.send(users[userIndex]);
})

// 4 PATCH /user/:id изменяет поле юзера по айди, возвращает обновленного юзера
app.patch('/user/:id', (req, res) => {
    const userIndex = users.findIndex( user => user.id === +req.params.id);

    if (req.body.age) {
        users[userIndex].age = +req.body.age;
    } if (req.body.name) {
        users[userIndex].name = req.body.name;
    } if (req.body.isMan !== undefined) {
        users[userIndex].isMan = req.body.isMan;
    }
    
    res.send(users[userIndex]);
})

// 5 DELETE /user/:id удаляет юзера по айдишке и возвращает булеан
app.delete('/user/:id', (req, res) => {
    const userId = +req.params.id;
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.send(true);
    } else {
        res.send(false);
    }
})

// 6 GET /users/:gender (M || F ) возвращает всех мужчин или женщин
app.get('/users/:gender', (req, res) => {
    const gender = req.params.gender;

    if (gender === 'M') {
        res.send(users.filter(user => user.isMan))
    } else if (gender === 'F') {
        res.send(users.filter(user => !user.isMan))
    } else {
        res.send("Incorrect param value");
    }
})