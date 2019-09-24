const express=require('express')
const router = express.Router();
const passport =require('passport');
const gravatar =require('gravatar');
const bcrypt = require('bcryptjs');
const jwt =require("jsonwebtoken");
const keys=require('../../config/keys')

//load user model
const User = require('../../models/User')

// @route    POST api/users
// @desc     Register user
// @access   Public
router.get('/test',(req,res)=>res.json({msg:"it workss"}));


// @route    POST api/users
// @desc     Register user
// @access   Public
router.post('/register',(req,res)=>{
	User.findOne({email:req.body.email})
		.then(user => {
			if(user){
				return res.status(400).json({email : 'email already exists'})
			}
			else {
				const avatar =gravatar.url(req.body.email,{
					s: '200', //size
					r: 'pg', //rating
					d: 'mm'	//default
				})


				const newUser = new User({
					name : req.body.name,
					email : req.body.email,
					avatar,
					password : req.body.password
				});

				bcrypt.genSalt(10,(err,salt)=> {
					bcrypt.hash(newUser.password,salt,(err,hash)=>{
						if (err) throw err;
						newUser.password=hash;
						newUser.save()
						.then(user=>res.json(user))
						.catch(err=> console.log(err))
					})
				})

			}
		})
})

// @route    POST api/users/login
// @desc     login user / returning JWT token
// @access   Public
router.post('/login',(req,res)=>{
	const email=req.body.email;
	const password=req.body.password;
	console.log("ko")
	//find user by email
	User.findOne({email})
	.then(user => {
		//check for user
		if (!user){
			return res.status(404).json({email:'user not found'});
		}

		//check password 
		bcrypt.compare(password,user.password)
		.then(isMatch =>{
			if(isMatch){
				//user matched


				const payload={id:user.id,name:user.name,avatar: user.avatar}
				console.log(payload)
				  //create jwt payload
				//sign token
				jwt.sign(
					payload,
					keys.secretOrKey,
					{expiresIn:3600},
					(err,token)=>{
						res.json({
							success:true,
							token:'Bearer ' + token
						})
					});
			}
			else {
				return res.status(400).json({password:'password incorrect'})
			}
		})
	})
});



// @route    GET  api/users/current
// @desc     return current user
// @access   private
router.get('/current',passport.authenticate('jwt',{session :false}),(req,res)=>{
	console.log("jiii3344")
	res.json({
		id: req.user.id,
		name: req.user.name,
		email: req.user.email
	});
})

module.exports=router;