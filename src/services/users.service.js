import UsersCollection from "../dao/usersCollection.js";

class UsersServices {
    async getAllUsers() {
        const users = await UsersCollection.getAllUsers();
        return users;
    }

    async getQueryUsers(query) {
        const users = await UsersCollection.getQueryUsers(query);
        return users;
    }

    async getUserByID(ID) {
        const user = await UsersCollection.getUserByID(ID);
        return user;
    }

    async createUser(userInfo) {
        //тут добавить проверку на email && login
        const user = await UsersCollection.createUser(userInfo);
        return user;
    }

    async updateFullUser(userID, params) {
        const updatedUser = await UsersCollection.updateFullUser(userID, params);
        if (!updatedUser) throw new Error(`Пользователь с ID ${userID} не найден`);
        return updatedUser;
    }

    async updateUser(userID, params) {
        const updatedUser = await UsersCollection.updateUser(userID, params);
        if (!updatedUser) throw new Error(`Пользователь с ID ${userID} не найден`);
        return updatedUser;
    }

    async deleteUser(userID) {
        const deletedUser = await UsersCollection.deleteUser(userID);
        return deletedUser;
    }

    async filterUsers(param) {
        const users = await UsersCollection.filterUsers(param);
        return users;
    }

    async checkEmailUsage(email, ID) {
        let users = await this.getAllUsers();
        if (ID) {
            users = users.filter(user => user.ID.toString() !== ID);
        }

        const user = users.find(user => user.email === email);
        return !!user;
    }

    async checkUsernameUsage(username, ID) {
        let users = await this.getAllUsers();
        if (ID) {
            users = users.filter(user => user.ID.toString() !== ID);
        }

        const user = users.find(user => user.username === username);
        return !!user;
    }
}

export default new UsersServices;