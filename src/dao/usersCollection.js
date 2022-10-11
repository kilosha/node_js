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

        return { ID: user.insertedId, ...userInfo};
    }

    async updateFullUser(userID, params) {
        const connection = await DBConnection.getConnection();
        const db = DBConnection.connectToDB(connection);

        await db
            .collection(MONGO_COLLECTION)
            .replaceOne({ _id: ObjectId(userID)}, params);

        connection.close();

        delete params.password;

        return { ID: ObjectId(userID), ...params};
    }

    async updateUser(userID, params) {
        const connection = await DBConnection.getConnection();
        const db = DBConnection.connectToDB(connection);

        await db
            .collection(MONGO_COLLECTION)
            .updateOne({ _id: ObjectId(userID)}, { $set: params });

        connection.close();

        //тут пароль убрать (тут вообще ток измённые поля)
        return { ID: ObjectId(userID), ...params};
    }

    async deleteUser(ID) {
        const connection = await DBConnection.getConnection();
        const db = DBConnection.connectToDB(connection);

        const user = await db
            .collection(MONGO_COLLECTION)
            .findOne(ObjectId(ID), { projection: { password: 0 }});
        
        await db
            .collection(MONGO_COLLECTION)
            .deleteOne({ _id: ObjectId(ID)});

        connection.close();

        if (user) delete Object.assign(user, {ID: user._id })._id;

        return user;
    }

    async filterUsers(param) {
        //Тут вообще либо объект, либо массив. Сделать фильтр отдельно!!!

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
        return user || {};
    }
}

export default new UsersCollection();