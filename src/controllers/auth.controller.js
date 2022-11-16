import { validationResult } from "express-validator";
import * as bcrypt from "bcrypt";
import pkg from "jsonwebtoken";
const { sign } = pkg;

import AuthServices from "../services/auth.service.js";

class AuthControllers {
  async login(req, res) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).send({
          success: false,
          errors: errors.array()
      });
    } else {
      try {
        const { email, password } = req.body;
        const user = await AuthServices.getUser(email);
        if (user) {
          const id = user.id;
          const compareUser = await bcrypt.compare(password, user.password);
          if (compareUser) {
            const token = sign({ email, id }, process.env.ACCESS_TOKEN_SECRET);
            res.send({ token });
          } else {
            throw new Error("Пароль не правильный!");
          }
        } else {
          throw new Error("Такого пользователя нет!");
        }
      } catch (err) {
        res.status(400).send({ message: err.message });
      }
    }
  }
}

export default new AuthControllers();