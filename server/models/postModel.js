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
    photo: String,
    requirements: Array,
    applications: Array
})
const Post = new mongoose.model('post' ,postSchema)
export default Post;

// new Post({
//     eventName: 'Life skills workshop',
//     orgId: '64f59bb900352382ac9664bb',
//     orgName: 'Lebanese Spotlight',
//     volNb: ['0', '16'],
//     location: 'beirut, ras el nabee, chrysalis',
//     startDate: ['17', 'September', '2023'],
//     endDate: ['10', 'November', '2023'],
//     schedules: [{days: ['MON'], time: ['5:00PM', '6:00PM']}],
//     about: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas similique asperiores error minima, modi dolorem quaerat accusantium veritatis libero at?Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur, autem?',
//     requirements: ['age: 15 - 19']
// }).save()


