import express from "express";
import {
  getAllTodos,
  saveTodo,
  getTodoById,
  updateTitleTodoById,
  getUserTodos,
  deleteAllTodos,
} from "../controllers/todo.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router
  .route("/")
  .get(getAllTodos)
  .post(auth, saveTodo)
  .delete(auth, deleteAllTodos);

router.patch("/:id", auth, updateTitleTodoById);

router.get("/user", auth, getUserTodos);

router.get("/:id", auth, getTodoById);

export default router;
