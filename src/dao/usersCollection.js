import DBConnection from "./index.js";
import { ObjectId } from "mongodb";

const MONGO_COLLECTION = "users";

class UsersCollection {
    async getAllUsers() {
        const connection = await DBConnection.getConnection();
        const db = DBConnection.connectToDB(connection);

        const users = await db
            .collection(MONGO_COLLECTION)
            .find({})
            .project({ password: 0 })
            .toArray();

        connection.close();

        users.forEach(user => delete Object.assign(user, {ID: user._id })._id);
        return users;
    }

    async getQueryUsers(query) {
        const connection = await DBConnection.getConnection();
        const db = DBConnection.connectToDB(connection);

        const users = await db
            .collection(MONGO_COLLECTION)
            .find({ age: { $gte: +query.min, $lte: +query.max} })
            .project({ password: 0 })
            .toArray();

        connection.close();

        users.forEach(user => delete Object.assign(user, {ID: user._id })._id);
        return users;
    }

    async getUserByID(ID) {
        const connection = await DBConnection.getConnection();
        const db = DBConnection.connectToDB(connection);

        const user = await db
            .collection(MONGO_COLLECTION)
            .findOne(ObjectId(ID), { projection: { password: 0 }});

        connection.close();

        if (user) delete Object.assign(user, {ID: user._id })._id;
        return user || {};
    }

    async createUser(userInfo) {
        const connection = await DBConnection.getConnection();
        const db = DBConnection.connectToDB(connection);

        const user = await db
            .collection(MONGO_COLLECTION)
            .insertOne(userInfo);

        connection.close();
        
        delete userInfo.password;
        delete Object.assign(userInfo, {ID: userInfo._id })._id;

        return userInfo;
    }

    async updateFullUser(userID, params) {
        let updatedUser;
        const connection = await DBConnection.getConnection();
        const db = DBConnection.connectToDB(connection);

        const user = await db
            .collection(MONGO_COLLECTION)
            .findOne(ObjectId(userID), { projection: { password: 0 }});
        
        if (user) { 
            updatedUser = await db
                .collection(MONGO_COLLECTION)
                .replaceOne({ _id: ObjectId(userID)}, params);

            delete Object.assign(user, {ID: user._id })._id;
        }

        connection.close();

        delete params.password;

        return updatedUser ? { ...user, ...params } : user;
    }

    async updateUser(userID, params) {
        let updatedUser;
        const connection = await DBConnection.getConnection();
        const db = DBConnection.connectToDB(connection);

        const user = await db
            .collection(MONGO_COLLECTION)
            .findOne(ObjectId(userID), { projection: { password: 0 }});

        if (user) { 
            updatedUser = await db
                .collection(MONGO_COLLECTION)
                .updateOne({ _id: ObjectId(userID)}, { $set: params });

            delete Object.assign(user, {ID: user._id })._id;
        }        
        
        connection.close();

        delete params.password;
        return updatedUser ? { ...user, ...params } : user;
    }

    async deleteUser(ID) {
        const connection = await DBConnection.getConnection();
        const db = DBConnection.connectToDB(connection);

        const user = await db
            .collection(MONGO_COLLECTION)
            .findOne(ObjectId(ID), { projection: { password: 0 }});
        
        if (user) {
            await db
                .collection(MONGO_COLLECTION)
                .deleteOne({ _id: ObjectId(ID)});

            delete Object.assign(user, {ID: user._id })._id;
        }

        connection.close();

        return user;
    }

    async filterUsers(param) {
        //?????? ???????????? ???????? ????????????, ???????? ????????????. ?????????????? ???????????? ????????????????!!!

        const connection = await DBConnection.getConnection();
        const db = DBConnection.connectToDB(connection);
        let users;

        if (param === "M") {
            users = await db
                .collection(MONGO_COLLECTION)
                .find({ isMan: true })
                .project({ password: 0 })
                .toArray();
        } else if (param === "F") {
            users = await db
                .collection(MONGO_COLLECTION)
                .find({ isMan: false  })
                .project({ password: 0 })
                .toArray();
        } else {
            users = await db
                .collection(MONGO_COLLECTION)
                .findOne(ObjectId(param), { projection: { password: 0 }});
        }

        connection.close();

        if (Array.isArray(users)) users.forEach(user => delete Object.assign(user, {ID: user._id })._id);
        if (users) delete Object.assign(users, {ID: users._id })._id;

        return users || {};
    }

    async getUserByEmail(email) {
        const connection = await DBConnection.getConnection();
        const db = DBConnection.connectToDB(connection);

        const user = await db
            .collection(MONGO_COLLECTION)
            .findOne( { email });

        connection.close();
        if (user) delete Object.assign(user, {ID: user._id })._id;

        return user || {};
    }
}

export default new UsersCollection();