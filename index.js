import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todo.js";
import userRoutes from "./routes/user.js";
import todosModel from "./models/todo.js";
import { connectToDatabase } from "./db.connection.js";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/user", userRoutes);
app.use("/todo", todoRoutes);

app.get("/", async (_req, res) => {
  try {
    const todos = await todosModel.find();
    res.status(200).json({ data: todos });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving todos. Please try again later." });
  }
});

app.use("*", (_req, res) => {
  res.status(404).json({
    message: "Resource not found. Please check the URL and try again.",
  });
});

connectToDatabase()
  .then(() => {
    console.log("Successfully connected to the database.");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
