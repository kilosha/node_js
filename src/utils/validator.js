import { body, param, query, oneOf } from 'express-validator';

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
                .isNumeric({ "no_symbols": true }).withMessage("Введите целое число")
        ]
    }

    // Проверяем, изменяется ли определенный параметр, если да - его валидируем
    validateUserUpdate() {
        return [
            body().custom(user => {
                return this.isValidUser(user);
            }),
            body('name').if(body('name').exists())
                .notEmpty().withMessage("Не заполнено обязательное поле name")
                .isString().withMessage("Имя пользователя должно быть строкой"),
            body("username").if(body('username').exists())
                .notEmpty().withMessage("Не заполнено обязательное поле username")
                .isString().withMessage("Username должно быть строкой"),
            body("email").if(body('email').exists())
                .notEmpty().withMessage("Не заполнено обязательное поле email")
                .isEmail().normalizeEmail().withMessage("Укажите корректный email (example@example.com)"),
            body("password").if(body('password').exists()).isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            }).withMessage("Пароль должен быть длиной не менее 8 символов, из них минимум 1 заглавная буква, 1 прописная, 1 число и 1 символ"),
            body("isMan").if(body('isMan').exists())
                .notEmpty().withMessage("Не заполнено обязательное поле isMan")
                .isBoolean().withMessage("Значение должно быть true или false"),
            body("age").if(body('age').exists())
                .notEmpty().withMessage("Не заполнено обязательное поле age")
                .isNumeric({ "no_symbols": true }).withMessage("Введите целое число")
        ]
    }

    validateID() {
        return [param("ID").isUUID().withMessage("ID должен быть в формате UUID")];
    }

    validateFilter() {
        return oneOf([
            param("param").isWhitelisted(["M", "F"]).withMessage("Допустимы значения F или M"),
            param("param").isUUID().withMessage("ID должен быть в формате UUID")
        ], "Фильтр возможен только по F, M или UUID")
    }

    isValidUser(user) {
        const { ID, name, username, email, password, isMan, age, ...other } = user;

        if (Object.keys(other).length > 0) {
            throw new Error('Объект содержит некорректные поля: ' + Object.keys(other));
        }

        return true;
    }

    isValidNewUser(user) {
        const { name, username, email, password, isMan, age, ...other } = user;

        if (Object.keys(other).length > 0) {
            throw new Error('Объект содержит некорректные поля: ' + Object.keys(other));
        }

        return true;
    }

    validateQueryIfPresent() {
        return [query().custom(query => {
            if (Object.keys(query).length > 0) {
                const { min, max, ...other } = query;
                if (Object.keys(other).length > 0) {
                    throw new Error('Некорректные query параметры: ' + Object.keys(other));
                }

                if (min > max) {
                    throw new Error('Некорректные query параметры: min должно быть <= max');
                }
            }
        }),
        query('min').isNumeric({ "no_symbols": true }).withMessage("Минимальный возраст должен быть целым числом"),
        query('max').isNumeric({ "no_symbols": true }).withMessage("Максимальный возраст должен быть целым числом")
        ]
    }
}

export default new Validator();