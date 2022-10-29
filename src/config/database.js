import e from 'express';
import Sequelize from 'sequelize';

let sequelize;

if (process.env.NODE_ENV === 'production') {
    sequelize = new Sequelize(process.env.DATABASE_URL, {ssl: { rejectUnauthorized: false }});
} else {
    sequelize = new Sequelize('todo', 'postgres', 'admin', {
        host: 'localhost',
        dialect: 'postgres'
    });
}

export default sequelize;