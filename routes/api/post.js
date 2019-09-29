const express=require('express')
const router = express.Router()
const mongoose =require('mongoose');
const passport =require('passport');

//load post model
const Post = require('../../models/Post');
//load profile model
const Profile = require('../../models/Profile');


//validation
const validatePostinput = require('../../validation/post');

// @route    GET api/profile/test
// @desc     Tests profile route
// @access   Public
router.get('/test',(req,res)=>res.json({msg:"post workss"}));

// @route    POST api/posts
// @desc     Create post
// @access   Private
router.post('/', passport.authenticate('jwt',{session:false}),(req,res)=>{
    const {errors, isValid } = validatePostinput(req.body);

    //check validation
    if(!isValid) {
        //Return any errors with 400 status
        return res.status(400).json(errors);
    }
    const newPost = new Post({
        text : req.body.text,
        name : req.body.name,
        avatar : req.body.avatar,
        user : req.user.id
    });

    newPost.save().then(post=> res.json(post));

});


// @route    Get api/posts
// @desc     Get posts
// @access   Public
router.get('/',(req,res)=>{
    Post.find()
     .sort({date:-1})
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound :'No Post found with that ID'}));
});

// @route    Get api/posts/:id
// @desc     Get posts by id
// @access   Public
router.get('/:id',(req,res)=>{
    Post.findById(req.params.id)
     .sort({date:-1})
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ nopostfound :'No Post found with that ID'}));
});

// @route    DELETE api/posts/:id
// @desc     DELETE posts by id
// @access   Private
router.delete('/:id', passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user : req.user.id})
     .then(profile => {
         Post.findById(req.params.id)
          .then(post => {
              //check for post owner
              if(post.user.toString() !== req.user.id){
                  return res.status(401).json({notauthorized:'user not authorized'});
              }

              //Delete
              post.remove().then(()=>res.json({ success:true }));
          })
          .catch(err=> res.status(404).json({ postnotfound :' No post found'}));
     });
});

// @route    POST api/posts/like/:id
// @desc     Like post
// @access   Private
router.post('/like/:id', passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user : req.params.id})
     .then(profile => {
         Post.findById(req.params.id)
          .then(post => {
              if(post.likes.filter(like=>like.user.toString() === req.user.id).length > 0){
                  return res.status(404).json({alreadyliked:"user already liked this post"});


              }

              //Add user id to likes array
              post.likes.unshift({user:req.user.id});

              post.save().then(post => res.json(post));
          })
          .catch(err=> res.status(404).json({ postnotfound :' No post found'}));
     });
});

// @route    POST api/posts/unlike/:id
// @desc     Unike post
// @access   Private
router.post('/unlike/:id', passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user : req.params.id})
     .then(profile => {
         Post.findById(req.params.id)
          .then(post => {
              if(post.likes.filter(like=>like.user.toString() === req.user.id).length = 0){
                  return res.status(404).json({notliked:"You have not yet liked this post"});
              }

              //Get remove index
              const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);

              //Splice out of array
              post.likes.splice(removeIndex,1);

              //save
              post.save().then(post => res.json(post));
          })


          .catch(err=> res.status(404).json({ postnotfound :' No post found'}));
     });
});


// @route    POST api/posts/comment/:id
// @desc     Add comment to post
// @access   Private
router.post('/comment/:id', passport.authenticate('jwt',{session:false}),(req,res)=>{
    const {errors, isValid } = validatePostinput(req.body);

    //check validation
    if(!isValid) {
        //Return any errors with 400 status
        return res.status(400).json(errors);
    }


    Post.findById(req.params.id)
     .then(post=>{
         const newComment ={
             text:req.body.text,
             name:req.body.name,
             avatar:req.body.avatar,
             user: req.user.id
         }

         //Add to comments array
         post.comments.unshift(newComment);

         //save
         post.save().then(post => res.json(post))
     })
     .catch(err => res.status(404).json({postnotfound: 'No post found'}));

});


// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     REMOVE comment from post
// @access   Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt',{session:false}),(req,res)=>{
    Post.findById(req.params.id)
     .then(post=>{
       //Check to see if the comment exists
       if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length===0){

        return res.status(404).json({commentnotexists :"Comment does not exist"});
       }

       //Get remove index
       const removeIndex = post.comments.map(item => item._id.toString()).indexOf(req.params.comment_id);

       //Splice comment out of array
       post.comments.splice(removeIndex,1);

       post.save().then(post => res.json(post));
     })
     .catch(err => res.status(404).json({postnotfound: 'No post found'}));

});
module.exports=router;