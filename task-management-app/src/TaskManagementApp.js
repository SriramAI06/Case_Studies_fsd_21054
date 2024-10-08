// src/TaskManagementApp.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

const Container = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const TaskList = styled.div`
  margin: 20px 0;
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const TaskCard = styled.div`
  padding: 10px;
  margin: 10px 0;
  background-color: #e1f5fe;
  border: 1px solid #b2ebf2;
  border-radius: 4px;
  cursor: grab;
`;

const InputField = styled.input`
  padding: 10px;
  width: calc(100% - 22px);
  margin: 10px 0;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const TaskManagementApp = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');

  // Load tasks from local storage
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  // Save tasks to local storage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (taskInput.trim()) {
      const newTask = { id: uuidv4(), text: taskInput.trim() };
      setTasks([...tasks, newTask]);
      setTaskInput('');
    }
  };

  const handleDeleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDrop = (e) => {
    const taskId = e.dataTransfer.getData('text/plain');
    const draggedTask = tasks.find((task) => task.id === taskId);
    const remainingTasks = tasks.filter((task) => task.id !== taskId);
    setTasks([...remainingTasks, draggedTask]);
  };

  return (
    <Container>
      <h1>Task Management</h1>
      <InputField
        type="text"
        placeholder="Add a new task"
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
      />
      <Button onClick={handleAddTask}>Add Task</Button>
      <TaskList onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            draggable
            onDragStart={(e) => handleDragStart(e, task.id)}
          >
            {task.text}
            <Button onClick={() => handleDeleteTask(task.id)}>Delete</Button>
          </TaskCard>
        ))}
      </TaskList>
    </Container>
  );
};

export default TaskManagementApp;
