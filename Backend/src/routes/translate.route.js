const express = require('express');
const router = express.Router();
const { translateText } = require('../controllers/translate.controller');
const auth = require('../middlewares/auth.middleware');

// Protected translation endpoint
router.post('/', auth, translateText);

module.exports = router;
