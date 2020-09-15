const express = require('express');
const dotEnv = require('dotenv');

//ROute files
const bootcamp = require('./routes/bootcamps');

//This loads all the env variables
dotEnv.config({ path: './config/config.env' });

const app = express();

//Mounts router with url
app.use('/api/v1/bootcamp',bootcamp);


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`));
