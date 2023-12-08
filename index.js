import express from "express";
import dbConnection from "./config/db.js";
import dotenv from 'dotenv';
import cors from 'cors';
import productRoute from "./routes/productsRoutes.js"
import collectionRoute from "./routes/collectionRoutes.js"

const app = express();
app.use(cors());
dotenv.config();
dbConnection();

app.use(express.static('public'));
app.use('/', productRoute);
app.use('/', collectionRoute);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});
