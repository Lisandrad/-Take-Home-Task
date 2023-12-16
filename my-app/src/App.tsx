import React, {FC, useState, ChangeEvent, useEffect} from 'react';
import './App.css';
import { ITask } from './Interfaces';
import TodoTask from './components/TodoTask'

const App: FC = () => {
  const [id, setId] = useState<string>('')
  const [task, setTask] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [deadline, setDeadline] = useState<number>(0)
  const [todolist, setTodoList] = useState<ITask[]>([])
  

  useEffect(() => {
    setTasks();
  }, [])

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if(event.target.name === "task"){
      setTask(event.target.value)
    } if(event.target.name === "description"){
      setDescription(event.target.value)
    }
    
     else if (event.target.name === "deadline"){
      setDeadline(Number(event.target.value))
    }   
  };

  const addTask = (): void => {
    const newTask:ITask = {taskName: task, description: description, deadline: deadline}
    
    createNewTask(newTask).then((res) => {
      alert(res.message);
      setTasks();
    })
    
    setTask("")
    setDescription("")
    setDeadline(0)
  }

  function setTasks():void {
    fetch("http://localhost:8000/task").then(response => response.json())
    .then(( data:any[] ) => {
      let todos:ITask[] = []; 
      console.log(data);
      data.forEach((task:any) => {
      todos.push({
        id: task["_id"],
        deadline: task["createAt"],
        taskName: task["taskName"],
        description: task['description'],
      })
      });
      setTodoList(todos);
    })
  }
 type PostResponse = {
  message: string
 };

 function createNewTask(taskToCreate:ITask):Promise<PostResponse> {
  
  console.log( JSON.stringify(taskToCreate));
 return fetch("http://localhost:8000/task",
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      },
    body: JSON.stringify(taskToCreate)
  })
  .then((response) => {return response.json()});

  }

  //PUT method
  function taskToEdit(task:ITask) {
    setTask(task.taskName);
    setDescription(task.description)
    setId(task.id ?? "");
  }
  
  const editTask = () => {
  fetch("http://localhost:8000/task",
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({_id: id, taskName: task, description: description})
      }
      ).then(response => response.json())
      .then(data=> {
        setTasks();
        cancel();
      })
  }

  const cancel = () => {
        setTask("");
        setDescription("")
        setId("");
  }



  //DELETE method

  function ToDelete(id:string) {
    
    fetch("http://localhost:8000/task",
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({_id: id})
    }
    ).then(response => response.json())
    .then(data=> {
       setTasks();
    })
  }

  return (
    <div className="App">
      <div className='header'>
        <div className='inputContainer'>
          <input type="text" placeholder='Task...' name='task' value={task} onChange={handleChange}/>
          <input type="text" placeholder='Description' name='description' value={description} onChange={handleChange}/>
          <input type="number" placeholder='DeadLine (in days)...' name='deadline' value={deadline} onChange={handleChange}/>
        </div>
        { 
          id != '' ? (
            <div>
              <button onClick={editTask}>Editar task</button>
              <button onClick={cancel}>Cancelar</button>
            </div>
          ) : 
          (<button onClick={addTask}>Agregar task</button>)
        }
        
      </div>
      <div className='todoList'>
        {todolist.map((task: ITask, key: number) => {
        return <TodoTask key={key} task={task} editHandler={taskToEdit} deleteHandler={ToDelete} />}
        )}
      </div>
    </div>
  );
}

export default App;
