import  * as express from 'express';
import connectToDatabase from "./dbConection"
import { Request, Response, NextFunction } from "express"
import { Db, Collection, InsertOneResult, ObjectId } from 'mongodb';


const app = express();
const test = connectToDatabase;

app.use(express.json())
const PORT = 8000;
let _db:Db;

function setDb() {
  connectToDatabase().then(dbConnected => {
   if(dbConnected) {
     _db = dbConnected;
   }
    else {
     throw new Error("Error al Conectar a DB");
    }
  });
}

//endPoint
app.get('/Task', async (req: Request, resp: Response) => {
  try {
   const taskColection: Collection = _db.collection('Task');

   const task = await taskColection.find({}).toArray(); // Buscar usuarios en la base de datos
   resp.send(task);
  } catch (error) {
  resp.status(500).send('Error al buscar usuarios');
}
});

app.post('/Task', async (req: Request, resp: Response) => {
  try {
    const newTask: Collection = _db.collection('Task');
    const { taskName, description, assignedTo, status } = req.body;

    const tasksObject = {
      taskName, 
      description, 
      assignedTo, 
      status, 
      createAt: new Date(),
    };
    
    const result: InsertOneResult<any> = await newTask.insertOne(tasksObject);

    if( result.insertedId) {
      resp.status(201).send('Tarea agregada exitosamente');
    } else {
      resp.status(500).send('Error al agregar la tarea');
    }
    
  } catch(error) {
    resp.status(500).send('Error al agregar la tarea');
  }
})

//method PUT
app.put('/task', async (req:Request, resp: Response) => {
  try {
    const taskToEdit = _db.collection('Task')
    const taskToUpdate = req.body;
    const {taskName, description, assignedTo} = req.body
    const taskId = taskToUpdate._id

    const updatedFields = { 
      taskName, 
      description, 
      assignedTo, 
      createAt: new Date(),
    };

    console.log(taskId)
    console.table(updatedFields);

    const updatedTask = await taskToEdit.findOneAndUpdate(
      { _id: new ObjectId(taskId) }, 
      {$set: updatedFields}
    );  
      resp.status(200).json({success: true, updatedTask} )

  } catch {
    resp.status(500).json({ success: false})
  }

})

//DELETE METHOD

app.delete('/task', async (req:Request, resp:Response) => {
  try{
    const taskToDelete = _db.collection('Task');
    const taskDeleted = req.body
    const taskId = taskDeleted._id

    const result = await taskToDelete.findOneAndDelete (
     {_id: new ObjectId(taskId)});

     resp.status(200).json({success: true, result} )

  } catch(error) {
    resp.status(400).json('Errroooooooorrrrrrr')
  }
})


app.listen(PORT, () => { 
    setDb();
    console.log(`Server running on http://localhost:${PORT}`);
  });