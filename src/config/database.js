import Sequelize from 'sequelize';

const sequelize = new Sequelize('todo', 'postgres', 'admin', {
    host: 'localhost',
    dialect: 'postgres'
});

export default sequelize;