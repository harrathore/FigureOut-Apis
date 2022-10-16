const express = require('express');
const mongoose = require('mongoose')

const app = express();
const port = process.env.port || 3000;


app.use(express.json())
app.use(express.urlencoded({ extended: true}));               //Code to parse body from the request

require('dotenv').config();

//Connect to MongoDb Database using Databsase Url


const mongoString = process.env.DATABASE_URL

mongoose.connect(mongoString);
const database = mongoose.connection
database.on('error', (error) => {
  console.log(error)
})

database.once('connected', () => {
  console.log('Database Connected');
})



const userRoutes = require('./Routes/UserRoutes');
const groupRoutes = require('./Routes/GroupRoutes');


app.use('/user', userRoutes);
app.use('/group', groupRoutes);


app.listen(port, function(){
    console.log("Server starts at port " + port);
})