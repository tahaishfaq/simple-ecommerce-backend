import mongoose from "mongoose";

const dbConnection = async () => {
    try {
        let conn = await mongoose.connect(process.env.DB_URL);
        console.log(`Database connected successfully`);
    } catch (error) {
        console.error(`Error in DB Connection: ${error.message}`);
    }
}

export default dbConnection;