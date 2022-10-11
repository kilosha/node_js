import { body, param, query, oneOf } from "express-validator";

class Validator {
    validateUser() {
        return [
            body().custom(user => {
                return this.isValidNewUser(user);
            }),
            body("name")
                .notEmpty().withMessage("Не заполнено обязательное поле name")
                .isString().withMessage("Имя пользователя должно быть строкой"),
            body("username")
                .notEmpty().withMessage("Не заполнено обязательное поле username")
                .isString().withMessage("Username должно быть строкой"),
            body("email")
                .notEmpty().withMessage("Не заполнено обязательное поле email")
                .isEmail().normalizeEmail().withMessage("Укажите корректный email (example@example.com)"),
            body("password")
                .notEmpty().withMessage("Не заполнено обязательное поле password")
                .isStrongPassword({
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1
                }).withMessage("Пароль должен быть длиной не менее 8 символов, из них минимум 1 заглавная буква, 1 прописная, 1 число и 1 символ"),
            body("isMan")
                .notEmpty().withMessage("Не заполнено обязательное поле isMan")
                .isBoolean().withMessage("Значение должно быть true или false"),
            body("age")
                .notEmpty().withMessage("Не заполнено обязательное поле age")
                .isInt({ min: 10, max: 100 }).withMessage("Введите целое число от 10 до 100")
        ]
    }

    // Проверяем, изменяется ли определенный параметр, если да - его валидируем
    validateUserUpdate() {
        return [
            body().custom(user => {
                return this.isValidUser(user);
            }),
            body("name").if(body("name").exists())
                .notEmpty().withMessage("Не заполнено обязательное поле name")
                .isString().withMessage("Имя пользователя должно быть строкой"),
            body("username").if(body("username").exists())
                .notEmpty().withMessage("Не заполнено обязательное поле username")
                .isString().withMessage("Username должно быть строкой"),
            body("email").if(body("email").exists())
                .notEmpty().withMessage("Не заполнено обязательное поле email")
                .isEmail().normalizeEmail().withMessage("Укажите корректный email (example@example.com)"),
            body("password").if(body("password").exists()).isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            }).withMessage("Пароль должен быть длиной не менее 8 символов, из них минимум 1 заглавная буква, 1 прописная, 1 число и 1 символ"),
            body("isMan").if(body("isMan").exists())
                .notEmpty().withMessage("Не заполнено обязательное поле isMan")
                .isBoolean().withMessage("Значение должно быть true или false"),
            body("age").if(body("age").exists())
                .notEmpty().withMessage("Не заполнено обязательное поле age")
                .isInt({ min: 10, max: 100 }).withMessage("Введите целое число от 10 до 100")
        ]
    }

    validateID() {
        return [param("ID").isMongoId().withMessage("ID должен быть в формате ObjectId")];
    }

    validateFilter() {
        return oneOf([
            param("param").isIn(["M", "F"]).withMessage("Допустимы значения F или M"),
            param("param").isMongoId().withMessage("ID должен быть в формате ObjectId")
        ], "Фильтр возможен только по F, M или ObjectId")
    }

    isValidUser(user) {
        const { ID, name, username, email, password, isMan, age, ...other } = user;

        if (Object.keys(other).length) {
            throw new Error("Объект содержит некорректные поля: " + Object.keys(other));
        }

        return true;
    }

    isValidNewUser(user) {
        const { name, username, email, password, isMan, age, ...other } = user;

        if (Object.keys(other).length) {
            throw new Error("Объект содержит некорректные поля: " + Object.keys(other));
        }

        return true;
    }

    validateQueryIfPresent() {
        return [
            query().custom(query => {
                if (Object.keys(query).length) {
                    const { min, max, ...other } = query;
                    if (Object.keys(other).length) {
                        throw new Error("Некорректные query параметры: " + Object.keys(other));
                    }

                    if (+min > +max) {
                        throw new Error("Некорректные query параметры: min должно быть <= max");
                    }
                }
                return true;
            }),
            query("min").if(query("max").exists()).isInt({ min: 10, max: 100 }).withMessage("Минимальный возраст должен быть целым числом от 10 до 100"),
            query("max").if(query("min").exists()).isInt({ min: 10, max: 100 }).withMessage("Максимальный возраст должен быть целым числом от 10 до 100")
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
            body("title")
            .notEmpty().withMessage("Не заполнено обязательное поле title")
            .isString().withMessage("Title должно быть строкой")
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