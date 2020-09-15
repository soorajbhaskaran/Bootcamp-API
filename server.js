const express = require('express');
const dotEnv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');

//This loads all the env variables
dotEnv.config({ path: './config/config.env' });

//connecting Route files
const bootcamp = require('./routes/bootcamps');

//connecting to database
connectDB();

const app = express();

//us
if (process.env.NODE_ENV === 'development') {

    app.use(morgan('dev'));
}

//Mounts router with url
app.use('/api/v1/bootcamp', bootcamp);


const PORT = process.env.PORT || 5000;

//saving as variable for unhandled rejection
const server = app.listen(PORT, console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`));

//Handling unhandled promise rejections
process.on('unhandledRejection', (error, promise) => {
    console.log(`Error:${error.message}`);
    
    //Close the server and exit process
    server.close(() => process.exit(1));
})