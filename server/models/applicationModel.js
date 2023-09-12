import mongoose from "mongoose";
const applicationSchema = new mongoose.Schema ({
    postId: String,
    userId: String,
    userInfo: Object,
    status: String
})
export default new mongoose.model('application' ,applicationSchema)