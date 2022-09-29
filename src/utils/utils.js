class Utils {
    _createErrorMessage(isUserNameAlreadyUsed, isEmailAlreadyUsed) {
        let message;
        if (!isUserNameAlreadyUsed) {
            message = "Введенный email уже используется";
        } else if (!isEmailAlreadyUsed) {
            message = "Введенный username уже используется";
        } else {
            message = "Введенныe username и email уже используются";
        }

        return message;
    }
}

export default new Utils();