const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const port = 4000;

mongoose
  .connect("mongodb://localhost:27017/myDatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  checked: { type: Boolean, default: false },
  category: {
    // id: { type: String, required: true },
    name: { type: String, required: true },
    colour: { type: String },
  },
  baseCategory: {
    // id: { type: String, required: true },
    name: { type: String, required: true },
    colour: { type: String },
  },
});

const categorySchema = new mongoose.Schema({
  name: String,
  colour: String,
});

const Task = mongoose.model("Task", taskSchema);
const Category = mongoose.model("Category", categorySchema);

// let tasks = [];

// let categories = [
//   { id: "1", name: "Completed", colour: "completed" },
//   { id: "2", name: "Urgent", colour: "urgent" },
//   { id: "3", name: "Later", colour: "later" },
// ];

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
});

app.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Error fetching categories" });
  }
});

app.delete("/categories/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting category" });
  }
});

app.post("/categories", async (req, res) => {
  try {
    console.log("Category received in backend:", req.body);
    const newCategory = new Category(req.body);
    console.log("Category created in backend:", newCategory);
    await newCategory.save();
    res.json(newCategory);
  } catch (error) {
    res.status(500).json({ error: "Error adding category" });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const myNewTask = {
      name: req.body.name,
      checked: req.body.checked,
      category: {
        name: req.body.category.name,
        colour: req.body.category.colour,
      },
      baseCategory: {
        name: req.body.category.name,
        colour: req.body.category.colour,
      },
    };
    console.log("Task received in backend:", myNewTask);
    const newTask = new Task(myNewTask);
    console.log("Task created:", newTask);
    const saving = await newTask.save();
    console.log("Task saved:", saving);
    res.json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Error adding task" });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting task" });
  }
});

// app.put("/tasks/:id", (req, res) => {
//   const taskId = req.params.id;
//   const { checked, category, baseCategory } = req.body;

//   const taskIndex = tasks.findIndex((task) => task.id === taskId);

//   if (taskIndex !== -1) {
//     const currentTask = tasks[taskIndex];

//     tasks[taskIndex] = {
//       ...currentTask,
//       checked,
//       category,
//       baseCategory,
//     };

//     res.json(tasks[taskIndex]);
//   } else {
//     res.status(404).json({ message: "Task not found" });
//   }
// });

app.put("/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Error updating task" });
  }
});

app
  .route("/newRoute")
  .get((req, res) => {
    res.json({ message: "Hello from the backend" });
  })
  .post((req, res) => {
    const { firstName, lastName } = req.body;
    const fullName = firstName + " " + lastName;
    console.log("Received message:" + fullName);

    res.json({ message: `Hello from the backend, ${fullName}` });
  });

app.delete("/tasks/:id", (req, res) => {
  tasks = tasks.filter((task) => task.id !== req.params.id);
  res.json({ message: "Task deleted" });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
