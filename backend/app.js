import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import connect from "./db/db.js";
import projectRoutes from "./routes/project.routes.js";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import cors from 'cors';

dotenv.config();


connect();

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Routes
app.use("/users", userRoutes);
app.use('/projects', projectRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});


export default app;
