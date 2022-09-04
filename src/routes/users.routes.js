import express from "express";
import users from "../../users.js";

const router = express.Router();

router.get('/', (req, res) => {
    if (Object.values(req.query).length) {
        res.send(users.filter( user => +req.query.min <= user.age && user.age <= +req.query.max))
    } else {
        res.send(users);
    }
})

router.post("/create", (req, res) => {
    const newUserId = users[users.length-1].id + 1;
    const newUser = {...req.body, id: newUserId}
    users.push(newUser);
    res.send(newUser);
})


router.put("/update/:id", (req, res) => {
    const userIndex = users.findIndex( user => user.id === +req.params.id);
    users[userIndex] = { ...users[userIndex], ...req.body};
    res.send(users[userIndex]);
})


router.patch('/update/:id', (req, res) => {
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


router.delete('/delete/:id', (req, res) => {
    const userId = +req.params.id;
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.send(true);
    } else {
        res.send(false);
    }
})


router.get('/:param', (req, res) => {
    const param = req.params.param;

    if (param === 'M') {
        res.send(users.filter(user => user.isMan))
    } else if (param === 'F') {
        res.send(users.filter(user => !user.isMan))
    } else {
        const user = users.find(user => user.id === +param)
        user ? res.send(user) : res.send("Пользователи не найдены");
    }
})

export default router;