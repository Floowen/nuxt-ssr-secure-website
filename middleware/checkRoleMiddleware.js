// checkRoleMiddleware.js

const { User } = require('../models'); // Pastikan ini mengarah ke model yang benar

// Middleware untuk memeriksa peran pengguna
const checkRole = (...roles) => {
  return async (req, res, next) => {
    const user = await User.findByPk(req.user.id, {
      include: ['roles'], // Pastikan relasi dengan model role sudah diatur
    });

    if (!user || !user.roles.some(role => roles.includes(role.name))) {
      return res.status(403).json({ error: 'Unauthorized action.' });
    }

    next();
  };
};

module.exports = checkRole;
