import todosModel from "../models/todo.js";

export const getAllTodos = async (_req, res) => {
  try {
    const todos = await todosModel.find().populate("userId", "name");
    res.status(200).json({ data: todos });
  } catch (error) {
    res.status(500).json({ message: "Couldn't find todos, please try again." });
  }
};

export const saveTodo = async (req, res) => {
  const { title } = req.body;
  try {
    const newTodo = await todosModel.create({ title, userId: req.id });
    res.status(201).json({ data: newTodo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTodoById = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await todosModel.findOne({ _id: id });
    if (todo) {
      res.status(200).json({ data: todo });
    } else {
      res.status(404).json({ message: "Todo not found." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// For lab
export const updateTitleTodoById = async (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  try {
    if (id && title) {
      const updatedTodo = await todosModel.findOneAndUpdate(
        { _id: id },
        { title },
        { new: true }
      );
      res.status(200).json({ data: updatedTodo });
    } else {
      res
        .status(400)
        .json({ message: "Must provide title and id to edit todo." });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserTodos = async (req, res) => {
  try {
    const todos = await todosModel.find({ userId: req.id });
    console.log("req.id: ", req.id);
    console.log("todos: ", todos);
    if (todos.length > 0) {
      res.status(200).json({ data: todos });
    } else {
      res
        .status(200)
        .json({ message: `Couldn't find any todos for ${req.id}` });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAllTodos = async (_req, res) => {
  try {
    await todosModel.deleteMany();
    res.status(200).json({ message: "Todos have been deleted successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
