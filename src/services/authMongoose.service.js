import UserModel from "../models/user.model.js";

class AuthMongooseServices {
    async getUser(email) {
        const user = await UserModel.findOne({email});
        return user || {};
    }
}

export default new AuthMongooseServices();