const express =require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const passport =require('passport');

// Define Routes
const user=require('./routes/api/user');
const post=require('./routes/api/post');
const profile=require('./routes/api/profile');

//intialize express
const app = express();

// DB 
const db =require('./config/keys').mongoURI;
console.log(db)

//passport middleware
app.use(passport.initialize());

//passport config
require('./config/passport')(passport);


// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//DB config
mongoose
	.connect(db,{useNewUrlParser: true,useUnifiedTopoly:true})
	.then(()=> console.log("mongo connected"))
	.catch(err=> console.log(err))


app.get('/',(req,res)=> res.send('hello world'));

/**Use routes */
app.use('/api/user',user)
app.use('/api/posts',post)
app.use('/api/profile',profile)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server started on port ${PORT}'));

