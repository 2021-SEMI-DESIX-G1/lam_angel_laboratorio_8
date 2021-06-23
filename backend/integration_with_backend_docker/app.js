const express = require("express");
const { body, validationResult } = require("express-validator");
const cors = require("cors");
const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

const Data = [
  {
    name: "Terminar clase de metodologías",
    completed: true,
  },
  {
    name: "Hacer laboratorio de programación",
    completed: false,
  },
];

const Tasks = {
  getTasks: (req, res) => {
    res.json({
      model: "Tasks",
      count: Data.length,
      data: Data,
    });
  },
  getTask: (req, res) => {
    res.json(Data[req.params.id]);
  },
  createTask: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json(errors);
    }
    const { name, completed } = req.body;
    Data.push({ name, completed });
    res.json({
      model: "Tasks",
      count: Data.length,
      data: Data,
    });
  },
  completeTask: (req, res) => {
    Data.forEach((item, index) => {
      if (item.name === req.params.id) {
        Data[index] = req.body;
      }
    });
    res.json({
      model: "Tasks",
      data: Data,
    });
  },
  deleteTask: (req, res) => {
    Data.forEach((item, index) => {
      if (item.name === req.params.id) {
        Data.splice(index, 1);
      }
    });
    res.json({
      model: "Tasks",
      data: Data,
    });
  },
};

const TasksValidations = {
  createTask: [
    body("name", "El nombre es incorrecto.").exists({
      checkNull: true,
      checkFalsy: true,
    }),
    body("completed", "El status es incorrecto").isBoolean(),
  ],
};

app.get("/api/v1/tasks/", Tasks.getTasks);
app.post("/api/v1/tasks/", TasksValidations.createTask, Tasks.createTask);
app.patch("/api/v1/tasks/:id", Tasks.completeTask);
app.delete("/api/v1/tasks/:id", Tasks.deleteTask);

app.listen(port, () => {
  console.log(`Ejemplo escuchando en: http://localhost:${port}`);
});
