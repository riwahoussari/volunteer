import mongoose from "mongoose";
const applicationSchema = new mongoose.Schema ({
    postId: String,
    orgId: String,
    userId: String,
    userInfo: Object
})
export default new mongoose.model('application' ,applicationSchema)