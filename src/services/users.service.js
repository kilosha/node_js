import Sequelize from 'sequelize';
import model from '../models/index.js';
const { User } = model;

class UsersServices {
    async getAllUsers() {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [
                ['id', 'ASC']
            ]
        });
        return users;
    }

    async getQueryUsers(query) {
        const users = await await User.findAll({
            where: query,
            attributes: { exclude: ['password'] },
            order: [
                ['id', 'ASC']
            ]
        });
        return users;
    }

    async getUserByID(id) {
        const user = await User.findOne({
            where: {
                id: id
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
            },
            returning: true,
            individualHooks: true
        });
        if (!updatedUser) throw new Error(`Пользователь с id ${userID} не найден`);
        return updatedUser[1][0];
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

    async checkEmailUsage(email, id) {
        let userWithSuchEmail;
        if (id) {
            userWithSuchEmail = await User.findOne({
                where: {
                    email,
                    id: {
                      [Sequelize.Op.not]: id
                    }
                } 
            });
        } else {
            userWithSuchEmail = await User.findOne({
                where: {
                    email
                } 
            });
        }
        return !!userWithSuchEmail;
    }

    async checkUsernameUsage(username, id) {
        let userWithSuchUsername;
        if (id) {
            userWithSuchUsername = await User.findOne({
                where: {
                    username,
                    id: {
                      [Sequelize.Op.not]: id
                    }
                } 
            });
        } else {
            userWithSuchUsername = await User.findOne({
                where: {
                    username
                } 
            });
        }
        return !!userWithSuchUsername;
    }
}

export default new UsersServices;