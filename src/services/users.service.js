import Sequelize from 'sequelize';
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
            },
            returning: true,
            individualHooks: true
        });
        if (!updatedUser) throw new Error(`Пользователь с ID ${userID} не найден`);
        return updatedUser[1][0];
    }

    //удалять и тудушки
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

    async checkEmailUsage(email, ID) {
        let userWithSuchEmail;
        if (ID) {
            userWithSuchEmail = await User.findOne({
                where: {
                    email,
                    id: {
                      [Sequelize.Op.not]: ID
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

    async checkUsernameUsage(username, ID) {
        let userWithSuchUsername;
        if (ID) {
            userWithSuchUsername = await User.findOne({
                where: {
                    username,
                    id: {
                      [Sequelize.Op.not]: ID
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