import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    videoId: String,
    userId: String,
    commentBody: String,
    userCommented: String,
    city: { type: String, default: "" },
    likes: { type: [String], default: [] },
    dislikes: { type: [String], default: [] },
    CommentOn: { type: Date, default: Date.now }
})
export default mongoose.model("Comments", commentSchema)