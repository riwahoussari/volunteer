import mongoose from "mongoose"
import passportLocalMongoose from 'passport-local-mongoose'
const orgSchema = new mongoose.Schema ({
    //account info
    userType: String,
    verified: String,
    username: {type: String, unique: true},
    password: String,
    //org basic info
    profilePic: String,
    orgName: String,
    address: Array,
    //contact info
    phoneNb: Array,
    email: Array,
    //links
    website: String,
    socialLinks: Object,
    //about
    about: String,
    mission: String,
    vision: String,
    //
    posts: Array,
    likes: Array
})

orgSchema.plugin(passportLocalMongoose)
const Org = new mongoose.model('org', orgSchema)

export default Org;

