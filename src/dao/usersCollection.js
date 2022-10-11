import DBConnection from "./index.js";
import { ObjectId } from "mongodb";

const MONGO_COLLECTION = "users";

class UsersCollection {
    async getAllUsers() {
        const connection = await DBConnection.getConnection();
        const db = DBConnection.connectToDB(connection);

        const users = await db
            .collection(MONGO_COLLECTION)
            .find()
            .toArray();
  
        connection.close();
        return users;
    }

    async getQueryUsers(query) {
        const connection = await DBConnection.getConnection();
        const db = DBConnection.connectToDB(connection);

        const users = await db
            .collection(MONGO_COLLECTION)
            .find({ age: { $gte: +query.min, $lte: +query.max} })
            .toArray();

        connection.close();
        return users;
    }

    async getUserByID(ID) {
        const connection = await DBConnection.getConnection();
        const db = DBConnection.connectToDB(connection);

        const user = await db
            .collection(MONGO_COLLECTION)
            .findOne(ObjectId(ID));

        connection.close();
        return user || {};
    }

    async createUser(userInfo) {
        const connection = await DBConnection.getConnection();
        const db = DBConnection.connectToDB(connection);

        const user = await db
            .collection(MONGO_COLLECTION)
            .insertOne(userInfo);

        connection.close();
        
        return { _id: user.insertedId, ...userInfo};
    }

    async updateFullUser(userID, params) {
        const connection = await DBConnection.getConnection();
        const db = DBConnection.connectToDB(connection);

        await db
            .collection(MONGO_COLLECTION)
            .replaceOne({ _id: ObjectId(userID)}, params);

        connection.close();

        return { _id: ObjectId(userID), ...params};
    }

    async updateUser(userID, params) {
        const connection = await DBConnection.getConnection();
        const db = DBConnection.connectToDB(connection);

        await db
            .collection(MONGO_COLLECTION)
            .updateOne({ _id: ObjectId(userID)}, { $set: params });

        connection.close();

        return { _id: ObjectId(userID), ...params};
    }

    async deleteUser(ID) {
        const connection = await DBConnection.getConnection();
        const db = DBConnection.connectToDB(connection);

        const user = await db
            .collection(MONGO_COLLECTION)
            .findOne(ObjectId(ID));
        
        await db
            .collection(MONGO_COLLECTION)
            .deleteOne({ _id: ObjectId(ID)});

        connection.close();

        return user;
    }

    // async findUserByEmail(email) {
    //     const connection = await DBConnection.getConnection();
    //     const db = DBConnection.connectToDB(connection);

    //     const user = await db
    //         .collection(MONGO_COLLECTION)
    //         .findOne({ email: { $eq: email} });

    //     connection.close();
    //     return user;
    // }
}

export default new UsersCollection();