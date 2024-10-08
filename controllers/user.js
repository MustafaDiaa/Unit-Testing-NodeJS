import userModel from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getAllUsers = async (_req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveUser = async (req, res) => {
  const user = req.body;
  try {
    const newUser = await userModel.create(user);
    res.status(201).json({ data: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password." });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email." });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.SECRET
    );
    res.status(200).json({ data: token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.params.id });
    if (user) {
      res.status(200).json({ data: user });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserByName = async (req, res) => {
  try {
    const { name } = req.query;
    const user = await userModel.findOne({ name });
    if (user) {
      res.status(200).json({ data: user });
    } else {
      res.status(200).json({ message: `There is no user with name: ${name}` });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAllUsers = async (_req, res) => {
  try {
    await userModel.deleteMany();
    res.status(200).json({ message: "Users have been deleted successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
