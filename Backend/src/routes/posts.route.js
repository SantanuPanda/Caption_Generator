const express = require('express');
const router = express.Router();
const middlewareposts = require('../middlewares/auth.middleware');
const multer = require('multer');
const { createpostscontroller } = require("../controllers/createpost.controller");

const upload = multer({ storage:multer.memoryStorage()});


router.post("/", middlewareposts, upload.single("image"), createpostscontroller);

module.exports = router;