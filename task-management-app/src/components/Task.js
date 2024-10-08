import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const Task = ({ task, index, columnId, onDelete }) => (
  <Draggable draggableId={task.id} index={index}>
    {(provided) => (
      <div 
        className="task"
        {...provided.draggableProps} 
        {...provided.dragHandleProps} 
        ref={provided.innerRef}
      >
        {task.content}
        <button onClick={() => onDelete(columnId, task.id)}>Delete</button>
      </div>
    )}
  </Draggable>
);

export default Task;