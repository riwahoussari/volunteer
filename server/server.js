import 'dotenv/config'
import express, { application } from "express";
const app = express()
import mongoose from "mongoose";
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import User from './models/userModel.js';
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
                else if(today > startDate && isNaN(endDate)){return true}
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
    Post.findOne({_id: req.params.id }).then(post => {res.json(post)})
})
// post user info / update field 
app.post('/user', bodyParser.json(),  (req, res)=>{
    if(req.isAuthenticated()){
        const userId = req.user._id;
        const userInfo = req.body;
        User.findOneAndUpdate({_id: userId}, {
            ...userInfo
        },{new: true}).then(user => {
            res.send(JSON.stringify({
                success: true,
                message: 'user info added successfully', 
                user
            }))
        }).catch(err => res.send(JSON.stringify({message: 'failed to add user information', success: false})))
    }
})
app.post('/org', bodyParser.json(),  (req, res)=>{
    console.log('/org post request')
    if(req.isAuthenticated()){
        const orgId = req.user._id;
        const orgInfo = req.body;
        Org.findOneAndUpdate({_id: orgId}, {
            ...orgInfo
        },{new: true}).then(user => {
            res.send(JSON.stringify({
                success: true,
                message: 'org info added successfully', 
                user
            }))
        }).catch(err => res.send(JSON.stringify({message: err.message, success: false})))
    }
})
//get liked posts
app.get('/user/likes', (req, res)=>{
    if(req.user){
        let likes = req.user.likes;
        Post.find().then(posts => {
            posts = posts.filter(post => likes.includes(post._id))
            res.json({posts})
        })
    }else(
        res.json({posts: null})
    )
})
// update liked posts
app.post('/user/likes', bodyParser.json(), async (req, res)=>{
    const userId = req.user._id;
    const postId = req.body.postId;
    let user;
    if(req.user.userType === 'user'){
        user = await User.findOne({_id: userId})
        // User.findOne({_id: userId}).then(result => user = result)
    }else if(req.user.userType === 'org'){
        user = await Org.findOne({_id: userId})
        // Org.findOne({_id: userId}).then(result => user = result)
    }

    let prevLikes = user.likes
    let newLikes;
    if(req.body.add){newLikes = [...prevLikes, postId];}
    else{newLikes = prevLikes.filter(like => like != postId);}

    try{
        user.userType === 'user' ?
            await User.findOneAndUpdate({_id: userId}, {likes: newLikes})
        :
            await Org.findOneAndUpdate({_id: userId}, {likes: newLikes})
            
    } catch (error) {
        res.send(JSON.stringify({message: `failed to update favorite posts ${error.message}`, success: false}))
    }
    res.send(JSON.stringify({message: 'favorite posts updated successfully', success: true}))
    
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
app.post('/post/apply/:postId', async (req, res)=>{
if(req.isAuthenticated()){
    try {
        var post = await Post.findOne({_id: req.params.postId})
    } catch (err) {console.log(err)}

    if(post.volNb[0] === post.volNb[1]){res.json({success: false, message: 'no more spots'})}
    else if(req.user.applications.includes(req.params.postId)){res.json({success: false, message: 'user already applied'})}
        
    else{
        //create new application
        try {
            var application = await new Application ({
                postId: req.params.postId,
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
            }).save()
        } catch (err) {console.log(err)}
        
        try {
            // store new application's id in post's applications array
            // increment applied volunteers number by 1
            post.volNb[0]++
            post.applications.push(application.id)
            await post.save()
        } catch (err) {console.log(err)}

        try {
            // store post's id in user's applications array
            await User.findOneAndUpdate({_id: req.user._id}, {$push: {applications: req.params.postId}})
        } catch (err) {console.log(err)}
                    
        res.json({success: true, message: 'application added successfully'})
                
            
    }
}
})
// get application for user info at post apply page
app.get('/applications/post/:postId', (req, res)=>{
    if(req.isAuthenticated()){
        Application.findOne({postId: req.params.postId, userId: req.user._id}).then(application=>{
            res.json({success: true, auth: {auth: true, user: {...application.userInfo, _id: req.user._id}}})
        })
    }else{
        res.json({success: false, message: 'user unauthorized'})
    }
})
// get applications for orgs seeApplications page
app.get('/applications/:postId', (req, res) => {
    if(req.isAuthenticated() && req.user.userType === 'org'){
        Application.find({postId: req.params.postId}).then(applications=>{
            res.json({success: true, applications})
        })
    }else{res.json({success: false, message: 'user unauthorized'})}
})
// update application status (accept/refject)
app.patch('/applications/:action/:appId', (req, res)=>{
    if(req.isAuthenticated() && req.user.userType === 'org'){
        if(req.params.action === 'accept'){
            Application.findOneAndUpdate({_id: req.params.appId}, {status: 'accepted'})
            .then(res.json({success: true}))
        } else if (req.params.action === 'reject'){
            Application.findOneAndUpdate({_id: req.params.appId}, {status: 'rejected'})
            .then(res.json({success: true}))
        } else if (req.params.action === 'attended'){
            Application.findOneAndUpdate({_id: req.params.appId}, {attendance: 'true'})
            .then(res.json({success: true}))
        } else if (req.params.action === 'didNotAttend'){
            Application.findOneAndUpdate({_id: req.params.appId}, {attendance: 'false'})
            .then(res.json({success: true}))
        }
        
    }else{res.json({success: false, message: 'user unauthorized'})}
})
//get org's my posts
app.get('/org/posts/:categ', (req, res)=>{
    let today = new Date().getTime();    

    Post.find({orgId: req.user.id}).then(posts => {
        console.log(posts)
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

app.post('/addPost', bodyParser.json(), (req, res)=>{
    if(req.isAuthenticated && req.user.userType === 'org'){
        console.log(req.body)
        new Post ({
            ...req.body,
            orgId: req.user.id,
            orgName: req.user.orgName
        }).save().then(newPost => {
            Org.findOneAndUpdate({id: req.user._id}, {$push: {posts: newPost.id}}).then(()=> res.json({success: true}))
        })
    }
})

//start app
app.listen(2500, ()=>{
    console.log('server up and running on port 2500');
})
