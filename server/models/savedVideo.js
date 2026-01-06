import mongoose from "mongoose";

const savedVideoSchema = mongoose.Schema({
    videoId: { type: String, required: true },
    Viewer: { type: String, required: true },
    SavedOn: { type: Date, default: Date.now }
})

export default mongoose.model('savedVideo', savedVideoSchema)
