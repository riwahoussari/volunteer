import mongoose from "mongoose";
const postSchema = new mongoose.Schema ({
    eventName: String,
    orgId: String,
    orgName: String,
    volNb: Array,
    location: String,
    startDate: Array,
    endDate: Array,
    schedules: Array,
    about: String,
    requirements: Array,
    applications: Array
})
const Post = new mongoose.model('post' ,postSchema)
export default Post;



