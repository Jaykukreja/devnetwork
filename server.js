const express =require('express');
const mongoose = require("mongoose");
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
//const connectDB = require('./config/db');

// DB 
connectDB()
const app = express();
// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define Routes
const user=require('./routes/api/user');
//const post=require('./routes/api/post');
//const profile=require('./routes/api/profile');
//const path = require('path');










app.get('/',(req,res)=> res.send('hello world'));


app.use('/api/user',user)
//app.use('/api/post',post)
//app.use('/api/profile',profile)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server started on port ${PORT}'));

