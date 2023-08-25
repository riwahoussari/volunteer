import 'dotenv/config'
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/userModel.js';

// passport.serializeUser(function(req, user, done) {
//     done(null, user._id);
// });
// passport.deserializeUser(function(user_id, done) {
//     User.findOne({_id: user_id}).then(function(user) {
//         return done(null, user);
//     }, function(err) {
//         return done(err,null);
//     });
// });

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:2500/auth/facebook/redirect"
  },
  function(accessToken, refreshToken, profile, cb) {
      console.log(profile)
    User.findOne({facebookId: profile.id}).then((currentUser)=>{
        if(currentUser){
            cb(null, currentUser)
        }else{
            new User ({
                userType: 'user',
                fullName: profile.displayName,
                username: profile.id,
                facebookId: profile.id,
            }).save().then((newUser) =>{
                cb(null, newUser)
            })
        }
    })
  }
));