// checkRoleMiddleware.js

const { User } = require('../models'); // Ensure this points to the correct path

// Middleware to check user roles
const checkRole = (...roles) => {
  return async (req, res, next) => {
    const user = await User.findByPk(req.user.id, {
      include: ['roles'], // Ensure the association with the role model is set up
    });

    if (!user || !user.roles.some(role => roles.includes(role.name))) {
      return res.status(403).json({ error: 'Unauthorized action.' });
    }

    next();
  };
};

module.exports = checkRole;