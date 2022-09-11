import UsersServices from '../services/users.service.js';

class UsersControllers {
    async getAllUsers() {
        const users = await UsersServices.getAllUsers();
        return users;
    }

    async getQueryUsers(query) {
        const queryUsers = await UsersServices.getQueryUsers(query);
        return queryUsers;
    }

    async getUserByID(ID) {
        const user = await UsersServices.getUserByID(ID);
        return user;
    }

    async createUser(userInfo) {
        const newUser = await UsersServices.createUser(userInfo);
        return newUser;
    }

    async updateFullUser(ID, params) {
        const updatedUser = await UsersServices.updateFullUser(ID, params);
        return updatedUser;
    }

    async updateUser(ID, params) {
        const updatedUser = await UsersServices.updateUser(ID, params);
        return updatedUser;
    }

    async deleteUser(ID) {
        const deletedUser = await UsersServices.deleteUser(ID);
        return deletedUser;
    }

    async filterUsers(param) {
        const filteredUsers = await UsersServices.filterUsers(param);
        return filteredUsers;
    }
}

export default new UsersControllers();