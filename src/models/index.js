import User from "./user.model.js";
import Todo from "./todo.model.js";

User.hasMany(Todo, { foreignKey: "user_id", onDelete: "CASCADE", hooks: true});
Todo.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE"});

const models = { User, Todo};
export default models;