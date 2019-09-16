const mongoose = require('mongoose');

//Database Connection
const connectDB = async () => {
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/devnetwork', {useNewUrlParser: true},(err) =>{
	if(!err) { console.log("mongo db connected")}
	else { console.log("error in Db Connection: "+err)}
});

};
module.exports = connectDB;