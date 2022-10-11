import { MongoClient } from "mongodb";

class DBConnection {

    async getConnection(){
        return MongoClient.connect(process.env.MONGO_CONNECTION_STRING);
    }

    connectToDB(connection) {
        return connection.db(process.env.MONGO_DB_NAME);
    }
}

export default new DBConnection();