require('dotenv').config();
require('express-async-errors');

//express
const express = require('express');
const app = express();

// rest of the packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const HttpStatus = require('http-status-codes');

//database
const connectDB = require('./db/connect');
const port = process.env.PORT || 5000;


// Routers
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');


//Middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');


app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static('./public'));


app.get('/', (req, res) => {
    res.status(HttpStatus.StatusCodes.OK).send('Welcome from Express!');
});


app.get('/api/v1', (req, res) => {
    console.log(req.signedCookies);
    res.status(HttpStatus.StatusCodes.OK).send('e-commerce api!');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
app.use(morgan);

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(port, console.log(`Server is listening on port ${port}...`));
    } catch (error) {
        console.log(error)
    }

}


start();






