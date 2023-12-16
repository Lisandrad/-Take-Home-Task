"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const dbConection_1 = require("./dbConection");
const mongodb_1 = require("mongodb");
const cors = require('cors');
const app = express();
const test = dbConection_1.default;
const corsOptions = {
    origin: '*', // Reemplaza con el dominio permitido
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 204,
};
app.use(express.json());
app.use(cors(corsOptions));
const PORT = 8000;
let _db;
function setDb() {
    (0, dbConection_1.default)().then(dbConnected => {
        if (dbConnected) {
            _db = dbConnected;
        }
        else {
            throw new Error("Error al Conectar a DB");
        }
    });
}
//endPoint
app.get('/Task', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskColection = _db.collection('Task');
        const task = yield taskColection.find({}).toArray(); // Buscar usuarios en la base de datos
        resp.send(task);
    }
    catch (error) {
        resp.status(500).json('Error al buscar usuarios');
    }
}));
app.post('/Task', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newTask = _db.collection('Task');
        const { taskName, description, assignedTo, status } = req.body;
        const tasksObject = {
            taskName,
            description,
            assignedTo,
            status,
            createAt: new Date(),
        };
        console.log(req.body);
        const result = yield newTask.insertOne(tasksObject);
        if (result.insertedId) {
            resp.status(201).json({ message: 'Tarea agregada exitosamente' });
        }
        else {
            resp.status(500).json('Error al agregar la tarea');
        }
    }
    catch (error) {
        resp.status(500).json('Error al agregar la tarea');
    }
}));
//method PUT
app.put('/task', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskToEdit = _db.collection('Task');
        const taskToUpdate = req.body;
        const { taskName, description, assignedTo } = req.body;
        const taskId = taskToUpdate._id;
        const updatedFields = {
            taskName,
            description,
            assignedTo,
            createAt: new Date(),
        };
        console.log(taskId);
        console.table(updatedFields);
        const updatedTask = yield taskToEdit.findOneAndUpdate({ _id: new mongodb_1.ObjectId(taskId) }, { $set: updatedFields });
        resp.status(200).json({ success: true, updatedTask });
    }
    catch (_a) {
        resp.status(500).json({ success: false });
    }
}));
//DELETE METHOD
app.delete('/task', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskToDelete = _db.collection('Task');
        const taskDeleted = req.body;
        const taskId = taskDeleted._id;
        console.log(req.body);
        const result = yield taskToDelete.findOneAndDelete({ _id: new mongodb_1.ObjectId(taskId) });
        resp.status(200).json({ success: true, result });
    }
    catch (error) {
        resp.status(400).json('Errroooooooorrrrrrr');
    }
}));
app.listen(PORT, () => {
    setDb();
    console.log(`Server running on http://localhost:${PORT}`);
});
