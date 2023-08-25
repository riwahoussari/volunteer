import mongoose from "mongoose"
import passportLocalMongoose from 'passport-local-mongoose';
const userSchema = new mongoose.Schema ({
    //account info
    userType: String,
    username: {type: String, unique: true, required: true},
    googleId: String,
    facebookId: String,
    //personal info
    fullName: String,
    dob: String,
    gender: String,
    address: String,
    //contact info
    phoneNb: String,
    email: String,
    //about
    profilePic: String,
    bio: String,
    skills: Array,
    //
    events: Array,
    likes: Array
})

userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model('user', userSchema)
export default User;
