import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task';

const TaskList = ({ tasks, columnId, onDelete }) => (
  <Droppable droppableId={columnId}>
    {(provided) => (
      <div 
        className="task-list"
        {...provided.droppableProps} 
        ref={provided.innerRef}
      >
        {tasks.map((task, index) => (
          <Task 
            key={task.id} 
            task={task} 
            index={index} 
            columnId={columnId}
            onDelete={onDelete}
          />
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);

export default TaskList;