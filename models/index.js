// models/index.js

const User = require('./User');
const Role = require('./Role');
const UserRole = require('./UserRole');

User.belongsToMany(Role, { through: UserRole, foreignKey: 'userId' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'roleId' });

module.exports = {
  User,
  Role,
  UserRole,
};