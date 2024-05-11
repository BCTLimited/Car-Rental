import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import fileUpload from "express-fileupload";

//
import connectDB from "./src/config/connectDB.js";
import notFound from "./src/middlewares/notFound.js";
import errorMiddleware from "./src/middlewares/error.js";

//RouteS Imports
import authRoutes from "./src/routes/authRoutes.js";
import carRoutes from "./src/routes/carRoutes.js";

// Configure Dotenv
dotenv.config();

//
const app = express();
const port = process.env.PORT || 3000;

//Middlewares
app.use(cors());
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Logging
if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}

//Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/car", carRoutes);

//Middlewares
app.use(notFound);
app.use(errorMiddleware);

// Connection
const startServer = async () => {
  try {
    await connectDB(process.env.DB_URI);
    console.log(`DB Connected!`);
    app.listen(port, console.log(`Server is listening at PORT:${port}`));
  } catch (error) {
    console.log(`Couldn't connect because of ${error.message}`);
    process.exit(1); //
  }
};

startServer();
