import mongoose from "mongoose";

const collectionsSchema = new mongoose.Schema({
    collectionImage: {
    type: String,
    required: false,
  },
    collectionImagePath: {
        type: String,
        required:false
    }, 
    collectionName: {
        type:String,
        required:false
    },
});
export default mongoose.model('collections', collectionsSchema);