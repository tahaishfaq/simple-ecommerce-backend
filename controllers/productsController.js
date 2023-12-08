import express from "express";
import productSchema from "../models/productSchema.js";
import multer from "multer";
import collectionsSchema from "../models/collectionsSchema.js";

const router = express.Router(); 

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

 export const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false); 
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

export const productController = async (req, res) => {
  try {
    const { productImage, productImagePath, price, title, description, colors, sizes, quantity,collections, collectionName} = req.body;
     const collection = await collectionsSchema.findById(collections);
     console.log(collection);
    const productImageData = req.file ? req.file.filename : "";
    const productImagePathData = req.file ? req.file.path : "";

    const productData = {
      title,
      description,
      price,
      sizes,
      colors,
      quantity,
      collections,
      collectionName,
      productImage: productImageData, 
      productImagePath: productImagePathData
    };

    const newProduct = new productSchema(productData);

    const savedProduct = await newProduct.save();
    if (savedProduct) {
      res.status(201).json({ message: 'product successfully' });
    } else {
      res.status(500).json({ error: 'product failed' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};

export const productEditController = async(req, res) =>{
    try {
    const productId = req.params.productId;
    const updatedProductData = req.body; 
    if (req.file) {
      updatedProductData.productImagePath = req.file.path;
    }

    const updatedProduct = await productSchema.findByIdAndUpdate(
      productId,
      updatedProductData,
      { new: true } 
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
}

export default productController;