const JWT = require('jsonwebtoken');
const usermodel = require("../model/user.model");

async function auth(req, res, next) {
  try {
    const token = req.cookies.usertoken;

    if (!token) {
      return res.status(401).json({
        error: "No token provided, please login first"
      });
    }

    // Verify the token
    const decoded = JWT.verify(token, process.env.JWT_KEY);
    
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        error: "Invalid token format"
      });
    }

    // Find user
    const user = await usermodel.findOne({ _id: decoded.id });
    
    if (!user) {
      return res.status(401).json({
        error: "User not found"
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: "Invalid token"
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: "Token expired, please login again"
      });
    }
    
    return res.status(401).json({
      error: "Authentication failed"
    });
  }
}

module.exports = auth;
