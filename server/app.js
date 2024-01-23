import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";

// Routes imported
import authRoute from "./routes/auth.route.js";
import categoryRoute from "./routes/category.route.js";
import productRoute from "./routes/product.route.js";
import orderRoute from "./routes/order.route.js";

const app = express();

const version = "v1";

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(cookieParser());

// Routes excicuted
app.use(`/api/${version}`, authRoute);
app.use(`/api/${version}`, categoryRoute);
app.use(`/api/${version}`, productRoute);
app.use(`/api/${version}`, orderRoute);

export default app;
