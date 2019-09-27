const express=require('express')
const router = express.Router()
const mongoose =require('mongoose');
const passport =require('passport');

//Load validation 
const validateProfileinput = require('../../validation/profile');

//load Profile model
const Profile = require('../../models/Profile');
//load User Profile
const User = require('../../models/User')


// @route    POST api/profile/test
// @desc     Tests profile route
// @access   Public
router.post('/test',(req,res)=>res.json({msg:"profile workss"}));


// @route    GET api/profile
// @desc     Get current user profile
// @access   Private
router.get('/', passport.authenticate('jwt',{session:false}),(req,res)=>{

    const errors={};

   Profile.findOne({ user: req.user.id }) //doubt
    .populate('user',['name','avatar'])
    .then(profile =>{
        if(!profile){
            errors.noprofile ="There is no profile for this user";
            return res.status(404).json({errors});
        }
        res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route    GET api/profile/all
// @desc     Get all profiles
// @access   Public
router.get('/all',(req,res) => {
    const errors = {};
    Profile.find()
    .populate('user',['name','avatar'])
    .then(profiles => {
        if(!profiles){
            errors.noprofile =' There are no profiles';
            return res.status(404).json();
        }
        res.json(profiles);
    })
    .catch(err => res.status(404).json({profile : "There are no profiles"}));
});

// @route    GET api/profile/handle/:handle
// @desc     Get profile by handle
// @access   Public

router.get('/handle/:handle', (req,res)=> {
    const errors ={};

    Profile.findOne({handle :req.params.handle})
    .populate('user',['name','avatar'])
    .then(profile => {
        if(!profile){
            errors.noprofile =' There is no profile for this user';
            res.status(404).status.json(errors);
        }
        res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});



// @route    GET api/profile/handle/:user_id
// @desc     Get profile by User ID
// @access   Public

router.get('/user/:user_id', (req,res)=> {
    const errors ={};
    console.log(req.params.user_id)
    Profile.findOne({user :req.params.user_id})
    .populate('user',['name','avatar'])
    .then(profile => {

        if(!profile){
            errors.noprofile =' There is no profile for this user';
            res.status(404).status.json(errors);
        }
        res.json(profile);
    })
    .catch(err => res.status(404).json(err))
});
 



// @route    POST api/profile
// @desc     Create or edit user profile
// @access   Private
router.post('/', passport.authenticate('jwt',{session:false}),
(req,res)=>{
    const {errors,isValid } = validateProfileinput(req.body);

    //check validation
    if(!isValid) {
        //Return any errors with 400 status
        return res.status(400).json(errors);
    }
        // Get fields
        const profileFields ={};
        profileFields.user = req.user.id;

        if(req.body.handle) profileFields.handle = req.body.handle;
        if(req.body.company) profileFields.company = req.body.company;
        if(req.body.website) profileFields.website = req.body.website;
        if(req.body.location) profileFields.location = req.body.location;
        if(req.body.bio) profileFields.bio = req.body.bio;
        if(req.body.status) profileFields.status = req.body.status;
        if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;

        //Skills - Split into array
        if(typeof req.body.skills !== 'undefined'){
            profileFields.skills= req.body.skills.split(',');
        }

        //Social
        profileFields.social={};
        if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
        if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
        if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
        if(req.body.instagram) profileFields.social.instagram = req.body.instagram;
        if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
        
        Profile.findOne({user : req.user.id})
        .then(profile=>{
            if (profile){
                //Update
                Profile.findOneAndUpdate(
                    { user:req.user.id}, 
                    {$set :profileFields}, 
                    {new :true}
                )
                .then(profile => res.json(profile));
                
            }else {
                //Create


                //Check if handle exists
                Profile.findOne({handle : profileFields.handle })
                .then(profile =>{
                    if(profile) {
                        errors.handle =' That handle already exists';
                        res.status(400).json(errors);
                    }
                //Save profile
                new Profile(profileFields).save().then(profile => res.json(profile) )
                });
            }
        })
    
    
    .catch(err => res.status(404).json(err));
});

module.exports=router;   