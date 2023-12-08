import express from 'express';
import productController, { productEditController } from '../controllers/productsController.js';
import { upload } from '../controllers/productsController.js';
import productSchema from '../models/productSchema.js';


const router = express.Router();
router.use(express.json());
router.post('/products',upload.single("productImage"), productController);
router.get("/products", async (req, res) => {
  try {
    const productsSchema = await productSchema.find(); 
    res.status(200).json(productsSchema);
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/products/:productId", async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await productSchema.findById(productId);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
});

router.get("/productsOfCollection/:collectionId", async (req, res) => {
  try {
    const collectionId = req.params.collectionId;
    
    const products = await productSchema.find({ collections: collectionId });

    if (!products) {
      return res.status(404).json({ error: "No products found for this collection" });
    }

    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});




router.put("/products/:productId", upload.single('productImage'), productEditController)

router.delete("/products/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const deletedProduct = await productSchema.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

export default router;