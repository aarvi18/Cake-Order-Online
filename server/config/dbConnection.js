import mongoose from "mongoose";
import envConfig from "./env.config.js";

(async () => {
  try {
    await mongoose.connect(envConfig.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB CONNECTED");

    mongoose.connection.on("error", (err) => {
      console.log("DB connection failed!", err);
      throw err;
    });
  } catch (err) {
    console.log("ERROR ", err);
    throw err;
  }
})();
