import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            res.status(401).send("Для работы нужен токен!");
        } else {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) throw new Error("Invalid token");
                req.user = user;
                next();
            })
        }
    } catch (err) {
        res.status(400).send(err.message);
    }
}

export default authenticateToken;