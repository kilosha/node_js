import {body, param, oneOf} from 'express-validator';

class Validator {
    validateNewUser() {
        return [
            body("name")
                .notEmpty().withMessage("Не заполнено обязательное поле name")
                .isString().withMessage("Имя пользователя должно быть строкой"),
            body("username")
                .notEmpty().withMessage("Не заполнено обязательное поле username")
                .isString().withMessage("Username должно быть строкой"),
            body("email")
                .notEmpty().withMessage("Не заполнено обязательное поле email")
                .isEmail().normalizeEmail().withMessage("Укажите корректный email"),
            body("isMan")
                .notEmpty().withMessage("Не заполнено обязательное поле isMan")
                .isBoolean().withMessage("Значение должно быть true или false"),
            body("age")
                .notEmpty().withMessage("Не заполнено обязательное поле age")
                .isNumeric({ "no_symbols": true}).withMessage("Введите целое число")
        ]
    }

    // Проверяем, изменяется ли определенный параметр, если да - его валидируем
    validateUser() {
        return [
            body('name').if(body('name').exists())
                .notEmpty().withMessage("Не заполнено обязательное поле name")
                .isString().withMessage("Имя пользователя должно быть строкой"),
            body("username").if(body('username').exists())
                .notEmpty().withMessage("Не заполнено обязательное поле username")
                .isString().withMessage("Username должно быть строкой"),
            body("email").if(body('email').exists())
                .notEmpty().withMessage("Не заполнено обязательное поле email")
                .isEmail().normalizeEmail().withMessage("Укажите корректный email"),
            body("isMan").if(body('isMan').exists())
                .notEmpty().withMessage("Не заполнено обязательное поле isMan")
                .isBoolean().withMessage("Значение должно быть true или false"),
            body("age").if(body('age').exists())
                .notEmpty().withMessage("Не заполнено обязательное поле age")
                .isNumeric({ "no_symbols": true}).withMessage("Введите целое число")
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
}

export default new Validator();