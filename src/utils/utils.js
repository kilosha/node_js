class Utils {
    _createErrors(isUserNameAlreadyUsed, isEmailAlreadyUsed, username, email) {
        const errors = [];
        if (isUserNameAlreadyUsed) {
            errors.push({
                value: username,
                msg: "Введенный username уже используется",
                param: "username",
                location: "body"
            });
        } 
        
        if (isEmailAlreadyUsed) {
            errors.push({
                value: email,
                msg: "Введенный email уже используется",
                param: "email",
                location: "body"
            });
        } 

        return errors;
    }
}

export default new Utils();