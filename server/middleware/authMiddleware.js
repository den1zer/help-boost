const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {

  req.user = decodedToken; 
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); 
  } else {
    res.status(403).json({ message: 'Доступ заборонено. Потрібні права адміна.' });
  }
};

module.exports = { isAuthenticated, isAdmin };