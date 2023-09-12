import mongoose from "mongoose";
import color from "colors";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected To MongoDB Database ${conn.connection.host}`.bgMagenta.white);
    } catch {
        console.log(`Error in MongoDB ${error}`.bgRed.white)
    }
}

export default connectDB;