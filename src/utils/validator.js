import { body, param, query, oneOf } from "express-validator";

class Validator {
    validateUser() {
        return [
            body().custom(user => {
                return this.isValidNewUser(user);
            }),
            body("username").notEmpty().withMessage("Не заполнено обязательное поле username"),
            body("username").if(body("username").exists()).isString().withMessage("Username должно быть строкой"),
            body("password").notEmpty().withMessage("Не заполнено обязательное поле password"),
            body("password").if(body("password").exists()).isStrongPassword({
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1
                }).withMessage("Пароль должен быть длиной не менее 8 символов, из них минимум 1 заглавная буква, 1 прописная, 1 число и 1 символ"),
            body("email").notEmpty().withMessage("Не заполнено обязательное поле email"),
            body("email").if(body("email").exists()).isEmail().normalizeEmail().withMessage("Укажите корректный email (example@example.com)"),
            body("gender").notEmpty().withMessage("Не заполнено обязательное поле gender"),
            body("gender").if(body("gender").exists()).isIn(['male', 'female']).withMessage("Пол должен быть male or female"),
            body("age").notEmpty().withMessage("Не заполнено обязательное поле age"),
            body("age").if(body("age").exists()).isInt({ min: 10, max: 100 }).withMessage("Введите целое число от 10 до 100")
        ]
    }

    // Проверяем, изменяется ли определенный параметр, если да - его валидируем
    validateUserUpdate() {
        return [
            body().custom(user => {
                return this.isValidUser(user);
            }),
            body("username").if(body("username").exists())
                .isString().withMessage("Username должно быть строкой"),
            body("email").if(body("email").exists())
                .isEmail().normalizeEmail().withMessage("Укажите корректный email (example@example.com)"),
            body("password").if(body("password").exists()).isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            }).withMessage("Пароль должен быть длиной не менее 8 символов, из них минимум 1 заглавная буква, 1 прописная, 1 число и 1 символ"),
            body("gender").if(body("gender").exists())
                .isIn(['male', 'female']).withMessage("Пол должен быть male or female"),
            body("age").if(body("age").exists())
                .isInt({ min: 10, max: 100 }).withMessage("Введите целое число от 10 до 100")
        ]
    }

    validateID() {
        return [param("ID").isInt( {min: 1}).withMessage("ID должен быть целым числом от 1")];
    }

    isValidUser(user) {
        const { id, username, email, password, gender, age, ...other } = user;

        if (Object.keys(other).length) {
            throw new Error("Объект содержит некорректные поля: " + Object.keys(other));
        }

        return true;
    }

    isValidNewUser(user) {
        const { username, password, email, gender, age, ...other } = user;

        if (Object.keys(other).length) {
            throw new Error("Объект содержит некорректные поля: " + Object.keys(other));
        }

        return true;
    }

    validateQueryIfPresent() {
        return [
            query().custom(query => {
                if (Object.keys(query).length) {
                    const { gender, ...other } = query;
                    if (Object.keys(other).length) {
                        throw new Error("Некорректные query параметры: " + Object.keys(other));
                    }
                }
                return true;
            }),
            query("gender").if(query("gender").exists()).isIn(['male', 'female']).withMessage("Пол должен быть male or female")
        ]
    }

    validateLogin() {
        return [
            body().custom(info => {
                return this.isValidLoginInfo(info);
            }), 
            body("email")
                .notEmpty().withMessage("Не заполнено обязательное поле email")
                .isEmail().normalizeEmail().withMessage("Укажите корректный email (example@example.com)"),
            body("password")
                .notEmpty().withMessage("Не заполнено обязательное поле password")
                .isString().withMessage("Пароль должен быть строкой")
            ]
    }

    isValidLoginInfo(info) {
        const { email, password, ...other } = info;

        if (Object.keys(other).length) {
            throw new Error("Объект содержит некорректные поля: " + Object.keys(other));
        }

        return true;
    }

    validateTodoTitle() {
        return [ 
            body().custom(todo => {
                return this.isValidTodoObject(todo);
            }), 
            body("title").notEmpty().withMessage("Не заполнено обязательное поле title"),
            body("title").if(body("title").exists()).isString().withMessage("Title должно быть строкой")
        ]
    }

    validateTodoQueryIfPresent() {
        return [
            query().custom(query => {
                if (Object.keys(query).length) {
                    const { isCompleted, ...other } = query;
                    if (Object.keys(other).length) {
                        throw new Error("Некорректные query параметры: " + Object.keys(other));
                    }
                }
                return true;
            }),
            query("isCompleted").if(query("isCompleted").exists()).isBoolean().withMessage("Значение должно быть true или false")
        ]
    }

    isValidTodoObject(todo) {
        const { title, ...other } = todo;

        if (Object.keys(other).length) {
            throw new Error("Объект содержит некорректные поля: " + Object.keys(other));
        }

        return true;
    }
}

export default new Validator(); 
