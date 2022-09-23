import fs from 'fs';

class AuthServices {

    async getUser(email) {
        return new Promise((res, rej) => {
            fs.readFile('./users.json', 'utf8', function (err, users) {
                if (err) {
                    rej(err);
                } else {
                    const user = JSON.parse(users).users.find(user => user.email === email);
                    res(user);
                }
            })
        })
    }
}

export default new AuthServices();