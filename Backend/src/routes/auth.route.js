const express = require('express');
const { registercotroller, logincontroller } = require('../controllers/auth.controller');
const JWT = require('jsonwebtoken');
const usermodel = require('../model/user.model');



const router = express.Router();
const auth = require('../middlewares/auth.middleware');

router.post("/register", registercotroller);
router.post("/login", logincontroller);

// Verify endpoint to check authentication status
router.get("/verify", auth, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username
    }
  });
});

// Logout endpoint
router.post("/logout", (req, res) => {
  res.clearCookie('usertoken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/'
  });
  res.json({ message: 'Logged out successfully' });
});

module.exports=router