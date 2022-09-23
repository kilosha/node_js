class User {
    constructor({name, username, email, isMan, age}, password) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
        this.isMan = isMan;
        this.age = age;
    }
}

export default User;