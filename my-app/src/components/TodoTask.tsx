import React, { FC } from "react";
import { ITask } from "../Interfaces";

interface Props {
  task: ITask,
  editHandler(task:ITask): void,
  deleteHandler(taskNameToDelete: string): void;
}

const TodoTask = ({ task, editHandler,deleteHandler }: Props)  => {
  return (
   <div className="task">
      <div className="content">
      <span>{task.taskName}</span>
      <span>{task.description}</span>
      <span>{task.deadline}</span>
      </div>
      <button onClick={() => {editHandler(task)} }>Update</button>
      <button onClick={() => {deleteHandler(task.id ?? "")} }>Delete</button>
    </div>
    );
}

export default TodoTask;


  