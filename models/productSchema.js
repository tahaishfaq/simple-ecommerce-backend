import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    productImage: {
    type: String,
    required: false,
  },
    productImagePath: {
        type: String,
        required:false
    }, 

    price: {
        type:String,
        required:false
    },
   title: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
   collections:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'collections',
      required: false,
    },
  
    colors: [
        {
        type: String,
        required: false,
        },
  ],
  sizes: [
        {
        type: String,
        required: false,
        },
  ],
    quantity: 
        {
        type: Number,
        required: false,
        },
    collectionName: {
        type:String,
        required:false
    },
  
    
});
export default mongoose.model('products', productsSchema);