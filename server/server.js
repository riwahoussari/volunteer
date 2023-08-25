import 'dotenv/config'
import express from "express";
const app = express()
import mongoose from "mongoose";
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo'
import Post from './models/postModel.js';
import Org from './models/orgModel.js'
import Application from './models/applicationModel.js';
import bodyParser from 'body-parser';

//setup session and passport
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    },
    store: MongoStore.create({mongoUrl: 'mongodb://127.0.0.1:27017/volunteerDB'})
}))  
app.use(passport.initialize())
app.use(passport.session())
//setup mongo database
mongo().catch(err => console.log('mongo err'))
async function mongo(){
    await mongoose.connect('mongodb://127.0.0.1:27017/volunteerDB')
}


//api
//CORS
import cors from 'cors'
app.use(cors({origin: 'http://localhost:3000', credentials: true}))
//auth routes
import authRouter from './routes/authRoutes.js'
import User from './models/userModel.js';
app.use('/auth', authRouter)
//get all posts
app.get('/posts/:categ', (req, res)=>{
    let today = new Date().getTime();    

    Post.find().then(posts => {
        posts = posts.filter(post => {
            let endDate = new Date(post.endDate.join(' ')).getTime()
            let startDate = new Date(post.startDate.join(' ')).getTime()

            if(req.params.categ == 'past'){
                if(today > endDate){return true}
                else{return false}
            }else if(req.params.categ === 'upcoming'){
                if(startDate > today){return true}
                else{return false}
            }if(req.params.categ === 'current'){
                if(today > startDate && today < endDate){return true}
                else{return false}
            }
        })
        res.json(posts)
    })
})
//get one post
app.get('/post/:id', (req,res)=>{
    Post.findOne({_id: req.params.id }).then(post => {
        if(req.isAuthenticated()){
            res.json({
                auth: {auth: true, user: req.user},
                post
            })
        }else{
            res.json({
                auth: {auth: false},
                post
            })
        }
    })
})
// post user info / update field 
app.post('/user', bodyParser.json(),  (req, res)=>{
    if(req.isAuthenticated()){
        const userId = req.user._id;
        const userInfo = req.body;
        User.findOneAndUpdate({_id: userId}, {
            ...userInfo
        }).then(() => {
            res.send(JSON.stringify({message: 'user info added successfully', success: true}))
        }).catch(err => res.send(JSON.stringify({message: 'failed to add user information', success: false})))
    }
})
app.post('/org', bodyParser.json(),  (req, res)=>{
    if(req.isAuthenticated()){
        const orgId = req.user._id;
        const orgInfo = req.body;
        Org.findOneAndUpdate({_id: orgId}, {
            ...orgInfo
        }).then(() => {
            res.send(JSON.stringify({message: 'org info added successfully', success: true}))
        }).catch(err => res.send(JSON.stringify({message: 'failed to add org information', success: false})))
    }
})
//get liked posts
app.get('/user/likes', (req, res)=>{
    if(req.user){
        let likes = req.user.likes;
        Post.find().then(posts => {
            posts = posts.filter(post => likes.includes(post._id))
            res.json({posts: posts, auth: {auth: true, user: req.user}})
        })
    }else(
        res.json({posts: null, auth: {auth: false, user: null}})
    )
})
// update liked posts
app.post('/user/likes', bodyParser.json(), (req, res)=>{
    const userId = req.user._id;
    const postId = req.body.postId;
    User.findOne({_id: userId}).then(user => {
        let prevLikes = user.likes;
        let newLikes;

        if(req.body.add){newLikes = [...prevLikes, postId];}
        else{newLikes = prevLikes.filter(like => like != postId);}

        User.findOneAndUpdate({_id: userId}, {likes: newLikes}).then(() => {
            res.send(JSON.stringify({message: 'favorite posts updated successfully', success: true}))
        }).catch(() => res.send(JSON.stringify({message: 'failed to update favorite posts', success: false})))
    })
})
// get users applications' events (history/applications)
app.get('/history/applications', (req, res)=>{
    if(req.isAuthenticated()){
        Application.find({userId: req.user._id}, {_id: 0, postId: 1}).then(applications=>{
            let postsIds = applications.map(app => app.postId)
            Post.find().then(allPosts => {
                let posts = allPosts.filter(post => {
                    return postsIds.includes(post.id)})
                res.json({success: true, posts: posts})
            })
        }).catch(err => res.json({success: false, message: err.message}))
    }else{
        res.json({success: false, message: 'user not authenticated'})
    }
})
// get users attended events (history/attended)
//get one org
app.get('/org/:id', (req,res)=>{
    Org.findOne({_id: req.params.id }).then(org => {
        res.json(org);
    })
})
// post apply page fetch for org & user & post
app.get('/post/apply/:postId', (req,res)=>{
if(req.isAuthenticated()){
    let postId = req.params.postId;
    Post.findOne({_id: postId}).then(post=>{
        Org.findOne({_id: post.orgId}).then(org => {
            if(post.applications.includes(req.user._id)){
                Application.findOne({postId: post._id, userId: req.user._id}).then(application => {
                    res.json({post: post, org: org, auth: {auth: true, user: {...application.userInfo, _id: req.user._id}}})
                })
            }else{
                res.json({post: post, org: org, auth: {auth: true, user: req.user}})
            }
        })
    })
}else{
    res.json({post: null, org: null, auth: {auth: false, user: null}})
}
})
// user application to a post 
app.post('/post/apply/:postId', (req, res)=>{
if(req.isAuthenticated()){
    Post.findOne({_id: req.params.postId}).then(post => {
        if(post.volNb[0] === post.volNb[1]){res.json({success: false, message: 'no more spots'})}
        else if(post.applications.includes(req.user._id)){res.json({success: false, message: 'user already applied'})}
        else{
            // add user id to post applications array
            let newArr = [...post.applications, req.user._id]
            Post.findOneAndUpdate({_id: req.params.postId}, {applications: newArr}).then(()=> {
                // add applications to database
                new Application ({
                    postId: req.params.postId,
                    orgId: post.orgId,
                    userId: req.user._id,
                    userInfo: {
                        fullName: req.user.fullName,
                        dob: req.user.dob,
                        gender: req.user.gender,
                        phoneNb: req.user.phoneNb,
                        email: req.user.email,
                        address: req.user.address,
                        profilePic: req.user.profilePic,
                        bio: req.user.bio,
                        skills: req.user.skills
                    }
                }).save().then(()=>{
                    res.json({success: true, message: 'application added successfully'})
                }).catch(err => res.json({success: false, message: err.message}))
            }).catch(err => res.json({success: false, message: err.message}))
        }
    }).catch(err => res.json({success: false, message: err.message}))
}else{
    res.json({success: false, message: 'user not authenticated'})
}
})
// get application for user info at post apply page
app.get('/applications/post/:postId', (req, res)=>{
    if(req.isAuthenticated()){
        Application.findOne({postId: req.params.postId, userId: req.user._id}).then(application=>{
            res.json({success: true, auth: {auth: true, user: {...application.userInfo, _id: req.user._id}}})
        })
    }else{
        res.json({success: false, message: 'user not authenticated'})
    }
})

//start app
app.listen(2500, ()=>{
    console.log('server up and running on port 2500');
})
