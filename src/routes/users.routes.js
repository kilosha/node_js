import express from "express";
import UsersControllers from "../controllers/users.controller.js";
import Validator from "../utils/validator.js";

const router = express.Router();

router.get('/', UsersControllers.getUsers);

router.get('/user/:ID', Validator.validateID(), UsersControllers.getUserByID);

router.post("/", Validator.validateNewUser(), UsersControllers.createUser);

router.put("/:ID", [Validator.validateID(), Validator.validateUser()], UsersControllers.updateFullUser);

router.patch('/:ID', [Validator.validateID(), Validator.validateUser()], UsersControllers.updateUser);

router.delete('/:ID', Validator.validateID(), UsersControllers.deleteUser);

router.get('/:param', Validator.validateFilter(), UsersControllers.filterUsers);

export default router;