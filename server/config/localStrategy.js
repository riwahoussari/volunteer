import passport from 'passport'
//user model
import User from '../models/userModel.js'
import Org from '../models/orgModel.js'
import { Strategy as LocalStrategy } from 'passport-local';

passport.use('user', new LocalStrategy(User.authenticate()));
passport.use('org', new LocalStrategy(Org.authenticate()));

passport.serializeUser((user, done)=>{
    done(null, {id: user.id, userType: user.userType})
})
passport.deserializeUser(async (user, done) => {
    try {
      let loadedUser;
  
      if (user.userType === 'user') {
        loadedUser = await User.findById(user.id);
      } else if (user.userType === 'org') {
        loadedUser = await Org.findById(user.id);
      } 

      done(null, loadedUser);
    } catch (error) {
      done(error);
    }
});


const localRegister = (req, res)=>{
    const {username, password} = req.body;

    User.findOne({username}).then(user => {
        if(user){
            res.json({success: false, redirect: true})
        }else{
            User.register(new User({username, userType: 'user'}), password, (err,user)=>{
                if(err){
                    console.log(err);
                    res.json({success: false, message: err.message})
                }
                else{
                    passport.authenticate('user')(req, res, ()=>{
                        res.json({success: true, auth: {auth: true, user: null}})
                    })
                }
            })
        }
    })
}
const localOrgRegister = (req, res)=>{
    const {username, password} = req.body;

    Org.findOne({username}).then(user => {
        if(user){
            res.json({success: false, redirect: true})
        }else{
            Org.register(new Org({username, userType: 'org'}), password, (err,user)=>{
                if(err){
                    console.log(err);
                    res.json({success: false, message: err.message})
                }
                else{
                    passport.authenticate('org')(req, res, ()=>{
                        res.json({success: true, auth: {auth: true, user: null}})
                    })
                }
            })
        }
    })
}

// const localLogin = (req, res)=>{
//     console.log(req.user)
//     passport.authenticate(['user', 'org'], {
//         successRedirect: 'http://localhost:3000',
//         failureRedirect: 'http://localhost:3000/login'
//     })
// }
const localLogin = (req, res)=>{
    User.findOne({username: req.body.username}).then(user => {
        if(!user){
            res.json({success: false, message: 'username or password is incorrect'})
        }else{
            const newUser = {
                userType: 'user',
                username: req.body.username,
                password: req.body.password
            }
            req.login(newUser, function(err){
                if(err){
                    console.log(err)
                }else{
                    passport.authenticate('user')(req, res, function(){
                        res.json({success: true, user})
                    })
                }
            })
        }
    })

}


const localOrgLogin = (req, res)=>{
    Org.findOne({username: req.body.username}).then(user => {
        if(!user){
            res.json({success: false, message: 'username or password is incorrect'})
        }else{
            const newUser = {
                userType: 'org',
                username: req.body.username,
                password: req.body.password
            }
            req.login(newUser, function(err){
                if(err){
                    console.log(err)
                }else{
                    passport.authenticate('org')(req, res, function(){
                        res.json({success: true, user})
                    })
                }
            })
        }
    })
}
const Local = {localRegister, localLogin, localOrgRegister, localOrgLogin}
export default Local
