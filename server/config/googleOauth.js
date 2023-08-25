import 'dotenv/config'
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModel.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:2500/auth/google/redirect"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOne({googleId: profile.id}).then((currentUser)=>{
        if(currentUser){
            cb(null, currentUser)
        }else{
            new User ({
                userType: 'user',
                username: profile.id,
                fullName: profile.displayName,
                googleId: profile.id,
                profilePic: profile._json.picture
            }).save().then((newUser) =>{
                cb(null, newUser)
            })
        }
    })
  }
));