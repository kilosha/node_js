import Sequelize from 'sequelize';
import db from '../config/database.js';

const User = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    age: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    gender: {
        type: Sequelize.STRING,
        allowNull: false
    }
},{
    timestamps: false,
    hooks: {
        afterCreate: (record) => {
            delete record.dataValues.password;
        },
        afterUpdate: (record) => {
            delete record.dataValues.password;
        }
    }
})

export default User;