import passport from 'passport'
import '../config/googleOauth.js'
import '../config/facebookOauth.js'
import bodyParser from 'body-parser';
import Local from '../config/localStrategy.js';
import {Router as expressRouter} from 'express'
const authRouter = expressRouter();

// google routes
authRouter.get('/google', passport.authenticate('google', {scope: ['profile']} ))
import url from 'url';
authRouter.get('/google/redirect', passport.authenticate('google', {failureRedirect: 'http://localhost:3000/login'}), (req, res)=>{
    if(!req.user.phoneNb){
        res.redirect(url.format({
            pathname:"http://localhost:3000/register/user/decode",
            query: {
              fullName: req.user.fullName,
              profilePic: req.user.profilePic
            }
        }));
    }else{
        res.redirect('http://localhost:3000/')
    }
})
// facebook routes
authRouter.get('/facebook', passport.authenticate('facebook', {scope: ['public_profile']} ))

authRouter.get('/facebook/redirect', passport.authenticate('facebook', {failureRedirect: 'http://localhost:3000/login'}), (req, res)=>{
    if(!req.user.phoneNb){
        res.redirect(url.format({
            pathname:"http://localhost:3000/register/user/decode",
            query: { fullName: req.user.fullName }
        }));
    }else{
        res.redirect('http://localhost:3000/')
    }
})

// local strategy routes
//user
authRouter.post('/local/register/user', bodyParser.json(), Local.localRegister);
authRouter.post('/local/login/user', bodyParser.json(), Local.localLogin);

//org
authRouter.post('/local/register/org', bodyParser.json(), Local.localOrgRegister);
authRouter.post('/local/login/org', bodyParser.json(), Local.localOrgLogin);

//check athentication and return boolean + user
authRouter.get('/user', (req, res)=>{
    if(req.isAuthenticated()){res.json({auth: true, user: req.user})}
    else{res.json({auth: false})}
})


// logout
authRouter.get('/logout', (req, res)=>{
    req.logout(err => {
        if (err) { res.json({logedOut: false}) }
        else{res.json({logedOut: true})}
      });
})

export default authRouter