import UserModel from "../models/user.model.js";

class UsersMongooseServices {
    async getAllUsers() {
        const usersDocs = await UserModel.find({}).lean();
        return usersDocs;
    }

    async getQueryUsers(query) {
        const usersDocs = await UserModel.find({ age: { $gte: +query.min, $lte: +query.max}}).lean();
        return usersDocs;
    }

    async getUserByID(ID) {
        const usersDocs = await UserModel.findById(ID);
        return usersDocs? usersDocs.toObject() : {};
    }

    async createUser(userInfo) {
        //тут добавить проверку на email && login
        const user = await new UserModel(userInfo).save();
        return user.toObject();
    }

    async updateFullUser(userID, params) {
        const updatedUser = await UserModel.findByIdAndUpdate(userID, params, {new: true});
        return updatedUser.toObject();
    }

    async updateUser(userID, params) {
        const updatedUser = await UserModel.findByIdAndUpdate(userID, params, {new: true});
        return updatedUser.toObject();
    }

    async deleteUser(userID) {
        const deletedUser = await UserModel.findByIdAndDelete(userID);
        return deletedUser.toObject();
    }

    async filterUsers(param) {
        let users;
        if (param === "M") {
            users = await UserModel.find({ isMan: true }).lean();
            return users;
        } else if (param === "F") {
            users = await UserModel.find({ isMan: false }).lean();
            return users;
        } else {
            users = await UserModel.findById(param);
            return users ? users.toObject() : {};
        }
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

export default new UsersMongooseServices;