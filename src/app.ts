import cors from "cors";
import express from "express";
import morgan from "morgan";
import config from "./config/config";
import connectDB from "./config/db";
import { HTTP_STATUS } from "./constants/httpStatus";
import { globalErrorHandler } from "./middlewares/errorHandler";
import routes from "./routes";
import { AppError } from "./utils/AppError";

// app
const app = express();

// configrations
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("dev"));

// api routes
app.use("/api", routes);

// handle unknown routes
app.use((req, res, next) => {
  next(
    new AppError(`Cannot find ${req.originalUrl} on this server`, HTTP_STATUS.NOT_FOUND)
  );
});

// Global error handler
app.use(globalErrorHandler);

// db and server connection
connectDB()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
