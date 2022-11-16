import db from "../config/database.js";
import model from '../models/index.js';
const { User, Todo } = model;

db.authenticate()
    .then(() => console.log("DB connected!"))
    .catch((err) => console.log(err));

//Users and Todos creating
User.bulkCreate([
    {
        username: "marry22",
        email: "example@example.com",
        password: "$2b$05$mXcYrpyWgO.Jd9eScqSkB.2Wuas6ypB/4CoFe4rpHcdv6i78YvgBe",
        gender: "female",
        age: 25
    },
    {
        username: "liza",
        email: "liza@mail.com",
        password: "$2b$05$mXcYrpyWgO.Jd9eScqSkB.2Wuas6ypB/4CoFe4rpHcdv6i78YvgBe",
        gender: "female",
        age: 20
    },
    {
        username: "pasha",
        email: "php@mail.com",
        password: "$2b$05$mXcYrpyWgO.Jd9eScqSkB.2Wuas6ypB/4CoFe4rpHcdv6i78YvgBe",
        gender: "male",
        age: 31
    }
])
    .then(
        User.findOne({
            where: {
                username: "marry22",
            },
        }).then((user1) => {
            Todo.create({
                title: "Купить молоко",
                user_id: user1.id,
            });
        })
    )
    .then(
        User.findOne({
            where: {
                username: "marry22",
            },
        }).then((user1) => {
            Todo.create({
                title: "Купить сосиски",
                user_id: user1.id,
                isCompleted: true
            });
        })
    )
    .then(
        User.findOne({
            where: {
                username: "pasha",
            },
        }).then((user1) => {
            Todo.create({
                title: "Купить машину",
                user_id: user1.id,
            });
        })
    )