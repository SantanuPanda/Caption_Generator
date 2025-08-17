const express = require('express');
const cors = require('cors');
const authroute = require('./routes/auth.route');
const postroute = require('./routes/posts.route');
const translateroute = require('./routes/translate.route');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({
    origin: 'https://caption-generator-1-4w73.onrender.com',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Set-Cookie'],
}));



app.use(express.json());
app.use(cookieParser())
app.use('/api/auth', authroute);
app.use('/api/posts', postroute);
app.use('/api/translate', translateroute);

module.exports=app;
