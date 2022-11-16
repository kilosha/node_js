import Sequelize from 'sequelize';
import db from '../config/database.js';
import User from "./user.model.js";

const Todo = db.define('todo', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isCompleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: "id"
        }
    }
},{
    timestamps: false
})

export default Todo;