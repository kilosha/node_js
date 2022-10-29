import model from '../models/index.js';
const { User } = model;

class UsersServices {
    async getAllUsers() {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        return users;
    }

    async getQueryUsers(query) {
        const users = await await User.findAll({
            where: query,
            attributes: { exclude: ['password'] }
        });
        return users;
    }

    async getUserByID(ID) {
        const user = await User.findOne({
            where: {
                id: ID
            },
            attributes: { exclude: ['password'] }
        });
        return user;
    }

    async createUser(userInfo) {
        const user =  await User.create(userInfo);
        return user;
    }

    async updateUser(userID, params) {
        const updatedUser = await User.update(params, {
            where: {
              id: userID
            }
        });
        if (!updatedUser) throw new Error(`Пользователь с ID ${userID} не найден`);
        return updatedUser;
    }

    async deleteUser(userID) {
        const deletedUser = await User.findOne({
            where: {
                id: userID
            },
            attributes: { exclude: ['password'] }
        });
        
        const destroyStatus = await User.destroy({
            where: {
              id: userID
            }
        });

        if (!destroyStatus) throw new Error('Что-то пошло не так');
        return deletedUser; 
    }

    //переделать на findOne
    async checkEmailUsage(email, ID) {
        let users = await this.getAllUsers();
        if (ID) {
            users = users.filter(user => user.id !== +ID);
        }

        const user = users.find(user => user.email === email);
        return !!user;
    }

    //переделать на findOne
    async checkUsernameUsage(username, ID) {
        let users = await this.getAllUsers();
        if (ID) {
            users = users.filter(user => user.id !== +ID);
        }

        const user = users.find(user => user.username === username);
        return !!user;
    }
}

export default new UsersServices;