import mongoose from "mongoose";

const { Schema, model, SchemaTypes } = mongoose;

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "A title is required."],
      minLength: [3, "Title must be at least 3 characters."],
      maxLength: [25, "Title cannot exceed 25 characters."],
      trim: true,
    },
    status: {
      type: String,
      enum: ["to do", "doing", "done"],
      default: "to do",
    },
    userId: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: [true, "User ID is required."],
    },
  },
  { timestamps: true }
);

const Todo = model("Todo", todoSchema);

export default Todo;
