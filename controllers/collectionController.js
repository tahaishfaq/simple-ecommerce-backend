import express from "express";
import collectionsSchema from "../models/collectionsSchema.js";
import multer from "multer";
import { storage } from "./productsController.js";
import { fileFilter } from "./productsController.js";
import { upload } from "./productsController.js";
const router = express.Router(); 

export const collectionController = async (req, res) => {
  try {
    const { collectionImage, collectionImagePath, collectionName } = req.body;

    const existingCollection = await collectionsSchema.findOne({ collectionName });
    if (existingCollection) {
      return res.status(409).json({ error: 'Collection already exists' }); 
    }

    const collectionImageData = req.file ? req.file.filename : '';
    const collectionImagePathData = req.file ? req.file.path : '';

    const collectionData = {
      collectionName,
      collectionImage: collectionImageData,
      collectionImagePath: collectionImagePathData,
    };

    const newCollection = new collectionsSchema(collectionData);

    const savedCollection = await newCollection.save();
    if (savedCollection) {
      res.status(201).json({ message: 'Collection successfully created' });
    } else {
      res.status(500).json({ error: 'Collection creation failed' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};

export const collectionEditController = async(req, res) =>{
    try {
    const collectionId = req.params.collectionID;
    const updatedCollectionData = req.body; 
    if (req.file) {
      updatedCollectionData.collectionImagePath = req.file.path;
    }

    const updatedCollection = await collectionsSchema.findByIdAndUpdate(
      collectionId,
      updatedCollectionData,
      { new: true } 
    );

    if (!updatedCollection) {
      return res.status(404).json({ error: "collection not found" });
    }

    res.status(200).json(updatedCollection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
}


export default collectionController;