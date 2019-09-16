const express =require('express');
//const connectDB = require('./config/db');
// Define Routes
const user=require('./routes/api/user');
//const post=require('./routes/api/post');
//const profile=require('./routes/api/profile');
//const path = require('path');

const app = express();

app.get('/',(req,res)=> res.send('hello world'));


app.use('/api/user',user)
//app.use('/api/post',post)
//app.use('/api/profile',profile)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server started on port ${PORT}'));

