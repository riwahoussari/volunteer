import 'dotenv/config'
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/userModel.js';


passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:2500/auth/facebook/redirect"
  },
  function(accessToken, refreshToken, profile, cb) {
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