import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes/index.js';
import database from './configuration/database.js';

const app = express();

// set default timezone
process.env.TZ = "America/Tijuana";

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json({ limit: '50mb' }));

// cookie parser
app.use(cookieParser());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use((req, res, next) => {
    console.log('::: Client request :::');
    console.log('Path: ', req.method, req.path);
    console.log('Body: ', JSON.stringify(req.body, null, '\t'));
    next(); // calling next middleware function or handler
});

app.use(router);

// error-handling middleware
app.use((error, req, res) => {
    console.log('::: Error Handling Middleware called :::');
    console.log('Path: ', req.method, req.path);
    console.error('Error: ', error);
    if (error.name === 'TokenExpiredError') {
        return res.send(401, 'Protected resource, token expired')
    }
    res.status(500).json({ error: { message: 'We sorry please try later' } });
});

app.listen(3000, () => {
    console.log(`Example app listening at http://localhost:3000`);
    // start connection to DB
    database.getInstance();
});