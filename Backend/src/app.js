const express = require('express');
const cors = require('cors');
const authroute = require('./routes/auth.route');
const postroute = require('./routes/posts.route');
const translateroute = require('./routes/translate.route');
const cookieParser = require('cookie-parser');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://caption-generator-maad.vercel.app'
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
    optionsSuccessStatus: 200
}));



app.use(express.json());
app.use(cookieParser())
app.use('/api/auth', authroute);
app.use('/api/posts', postroute);
app.use('/api/translate', translateroute);

module.exports=app;
