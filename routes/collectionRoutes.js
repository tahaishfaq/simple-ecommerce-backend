import express from 'express';
import collectionController, { collectionEditController } from '../controllers/collectionController.js';
import { upload } from "../controllers/productsController.js";
import collectionsSchema from '../models/collectionsSchema.js';
import productSchema from '../models/productSchema.js';
const router = express.Router();
router.use(express.json());
router.post('/collections',upload.single("collectionImage"), collectionController);
router.get("/collections", async (req, res) => {
  try {
    const collections = await collectionsSchema.find();
    const collectionsWithProducts = [];

    for (const collection of collections) {
      const products = await productSchema.find({ collections: collection._id }); // Assuming you have a collectionId field in your product schema to link it to collections
      let outOfStockCount = 0;
      let inStockCount = 0;
      console.log(products);
      for (const product of products) {
        if (product.quantity === 0) {
          outOfStockCount++;
        } else {
          inStockCount++;
        }
      }

      const collectionWithProducts = {
        collection,
        outOfStock: outOfStockCount,
        inStock: inStockCount,
      };
      collectionsWithProducts.push(collectionWithProducts);
    }

    res.status(200).json(collectionsWithProducts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/collections/:collectionID", async (req, res) => {
  try {
    const collectionId = req.params.collectionID;
    const products = await productSchema.find({ collections: collectionId });

    if (!products || products.length === 0) {
      return res.status(404).json({ error: "Collection not found or no products in the collection" });
    }

    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/collectionsInfo/:collectionID", async (req, res) => {
    try {
        const collectionID = req.params.collectionID;
        const collection = await collectionsSchema.findById(collectionID);

        if (!collection) {
            return res.status(404).json({ error: "collection not found" });
        }
        res.status(200).json(collection);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
});

router.delete("/collections/:collectionID", async (req, res) => {
  try {
    const collectionId = req.params.collectionID;
    const collection = await collectionsSchema.findById(collectionId);
    if (!collection) {
      return res.status(404).json({ error: "Collection not found" });
    }
    await productSchema.deleteMany({ collections: collectionId });
    await collectionsSchema.findByIdAndDelete(collectionId);
    res.status(200).json({ message: "Collection and related products deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

router.put("/collections/:collectionID", upload.single('collectionImage'), collectionEditController)

export default router;