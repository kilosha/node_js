import model from '../models/index.js';
const { User } = model;

class AuthServices {
    async getUser(email) {
        const user = await await User.findOne({
            where: {email}
        });
        return user;
    }
}

export default new AuthServices();