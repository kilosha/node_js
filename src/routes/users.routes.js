import express from "express";
import UsersControllers from "../controllers/users.controller.js";

const router = express.Router();

router.get('/', async (req, res) => {
    let users = [];
    try {
        if (Object.values(req.query).length) {
            users = await UsersControllers.getQueryUsers(req.query);
        } else {
            users = await UsersControllers.getAllUsers();  
        }
        res.send(users);
    } catch (e) {
        res.send(e.message);
    }
})

router.get('/user/:id', async (req, res) => {
    try {
        const user = await UsersControllers.getUserByID(req.params.id);
        res.send(user);
    } catch (e) {
        res.send(e.message);
    }
})

router.post("/", async (req, res) => {
    try {
        const newUser = await UsersControllers.createUser(req.body);
        res.send(newUser);
    } catch(e) {
        res.send(e.message);
    }
})

router.put("/:id", async (req, res) => {
    try {
        const updatedUser = await UsersControllers.updateFullUser(req.params.id, req.body);
        res.send(updatedUser);
    } catch (e) {
        res.send(e.message);
    }
})

router.patch('/:id', async (req, res) => {
    try {
        const updatedUser = await UsersControllers.updateUser(req.params.id, req.body);
        res.send(updatedUser);
    } catch (e) {
        res.send(e.message);
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await UsersControllers.deleteUser(req.params.id);
        res.send(deletedUser);
    } catch (e) {
        res.send(e.message);
    }
})

router.get('/:param', async (req, res) => {
    try {
        const filteredUsers = await UsersControllers.filterUsers(req.params.param);
        res.send(filteredUsers);
    } catch (e) {
        res.send(e.message);
    }
})

export default router;