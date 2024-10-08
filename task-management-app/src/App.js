import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskList from './components/TaskList';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState({
    'myTasks': [],
    'highPriority': [],
    'done': []
  });

  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
      // Ensure the stored data has the expected structure
      if (
        storedTasks.myTasks && 
        Array.isArray(storedTasks.myTasks) && 
        storedTasks.highPriority && 
        Array.isArray(storedTasks.highPriority) && 
        storedTasks.done && 
        Array.isArray(storedTasks.done)
      ) {
        setTasks(storedTasks);
      } else {
        // Handle cases where stored data is invalid or missing
        setTasks({
          'myTasks': [],
          'highPriority': [],
          'done': []
        });
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleInputChange = (e) => {
    setNewTask(e.target.value);
  };

  const addTask = () => {
    if (newTask.trim() !== '') {
      const newTaskObj = {
        id: Date.now().toString(),
        content: newTask
      };
      setTasks({
        ...tasks,
        myTasks: [...tasks.myTasks, newTaskObj]
      });
      setNewTask('');
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return; 

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      // Reorder within the same column
      const column = source.droppableId;
      const copiedItems = Array.from(tasks[column]);
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      setTasks({
        ...tasks,
        [column]: copiedItems
      });
    } else {
      // Move to a different column
      const sourceColumn = source.droppableId;
      const destColumn = destination.droppableId;
      const sourceItems = Array.from(tasks[sourceColumn]);
      const destItems = Array.from(tasks[destColumn]);

      // Instead of splicing and mutating arrays directly,
      // we'll create new arrays to prevent unnecessary re-renders
      const updatedTasks = { ...tasks };
      updatedTasks[sourceColumn] = sourceItems.filter((_, index) => index !== source.index);
      updatedTasks[destColumn] = [...destItems, sourceItems[source.index]]; 

      setTasks(updatedTasks);
    }
  };

  const deleteTask = (columnId, taskId) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [columnId]: prevTasks[columnId].filter((task) => task.id !== taskId)
    }));
  };

  return (
    <div className="container">
      <h1>Task Management App</h1>
      <div className="input-area">
        <input 
          type="text" 
          placeholder="Enter task" 
          value={newTask} 
          onChange={handleInputChange} 
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="columns">
          <div className="column">
            <h2>My Tasks</h2>
            <TaskList tasks={tasks.myTasks} columnId="myTasks" onDelete={deleteTask} />
          </div>
          <div className="column">
            <h2>High Priority Tasks</h2>
            <TaskList tasks={tasks.highPriority} columnId="highPriority" onDelete={deleteTask} />
          </div>
          <div className="column">
            <h2>Done</h2>
            <TaskList tasks={tasks.done} columnId="done" onDelete={deleteTask} />
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default App;