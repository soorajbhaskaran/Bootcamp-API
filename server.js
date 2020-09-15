const express = require('express');
const dotEnv = require('dotenv');

//This loads all the env variables
dotEnv.config({ path: './config/config.env' });

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`));
