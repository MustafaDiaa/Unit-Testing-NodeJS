import express from "express";
import {
  saveUser,
  deleteAllUsers,
  getUserByName,
  getAllUsers,
  getUserById,
  login,
} from "../controllers/user.js";

const router = express.Router();

router.get("/", getAllUsers);

router.post("/signup", saveUser);

router.post("/login", login);

router.get("/search", getUserByName);

router.delete("/", deleteAllUsers);

router.get("/:id", getUserById);

export default router;
