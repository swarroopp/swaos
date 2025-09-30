import React, { useState } from 'react';
import Todo from '../Todo/Todo';
import './Todo.css';

const TodoWindow = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return <Todo onClose={onClose} />;
};

export default TodoWindow;