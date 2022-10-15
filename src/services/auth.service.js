import UsersCollection from "../dao/usersCollection.js";

class AuthServices {
    async getUser(email) {
        const user = await UsersCollection.getUserByEmail(email);
        return user;
    }
}

export default new AuthServices();