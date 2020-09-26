const express = require('express');
const fileUpload = require('express-fileupload');
const dotEnv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const customError = require('./middleware/error');
const colors = require('colors');
const path = require('path');

//This loads all the env variables
dotEnv.config({ path: './config/config.env' });

//connecting Route files
const bootcamp = require('./routes/bootcamps');
const course = require('./routes/courses');
const user=require('./routes/auth');


//connecting to database
connectDB();


//Declaring app
const app = express();

//Body parsing
app.use(express.json());

//using middleware only in development mode
if (process.env.NODE_ENV === 'development') {

    app.use(morgan('dev'));
}

//File uploading
app.use(fileUpload());

//Mounts router with url
app.use('/api/v1/bootcamp', bootcamp);
app.use('/api/v1/courses', course);
app.use('/api/v1/user', user);

//Declaring static file
app.use(express.static(path.join(__dirname, 'public')));

//use express custom error handler
app.use(customError);


const PORT = process.env.PORT || 5000;

//saving as variable for unhandled rejection
const server = app.listen(PORT, console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

//Handling unhandled promise rejections
process.on('unhandledRejection', (error, promise) => {
    console.log(`Error:${error.message}`.red.bold);

    //Close the server and exit process
    server.close(() => process.exit(1));
})