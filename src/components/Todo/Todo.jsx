import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Todo.css';

const Todo = ({ onClose }) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isBackendAvailable, setIsBackendAvailable] = useState(false);  // Set to false by default
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/todos');
      setTodos(response.data);
      setIsBackendAvailable(true);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setIsBackendAvailable(false);
      // Use local storage as fallback
      const localTodos = localStorage.getItem('todos');
      if (localTodos) {
        setTodos(JSON.parse(localTodos));
      }
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    setIsSubmitting(true);
    
      const newTodoItem = {
      title: newTodo.trim(),
      description: '',
      priority: priority.toLowerCase(),  // Ensure priority is lowercase
      status: 'pending'
    };    try {
      if (isBackendAvailable) {
        const response = await axios.post('http://localhost:5000/api/todos', newTodoItem);
        setTodos([response.data, ...todos]);
      } else {
        setTodos([newTodoItem, ...todos]);
        localStorage.setItem('todos', JSON.stringify([newTodoItem, ...todos]));
      }
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
      // Fallback to local storage
      setTodos([newTodoItem, ...todos]);
      localStorage.setItem('todos', JSON.stringify([newTodoItem, ...todos]));
      setNewTodo('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTodo = async (id, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    const updatedTodos = todos.map(todo => 
      (todo.id === id || todo._id === id) ? { ...todo, status: newStatus } : todo
    );

    try {
      if (isBackendAvailable) {
        const response = await axios.patch(`http://localhost:5000/api/todos/${id}`, {
          status: newStatus
        });
        setTodos(todos.map(todo => 
          (todo.id === id || todo._id === id) ? response.data : todo
        ));
      } else {
        setTodos(updatedTodos);
        localStorage.setItem('todos', JSON.stringify(updatedTodos));
      }
    } catch (error) {
      console.error('Error updating todo:', error);
      // Fallback to local update
      setTodos(updatedTodos);
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
    }
  };

  const deleteTodo = async (id) => {
    try {
      if (isBackendAvailable) {
        await axios.delete(`http://localhost:5000/api/todos/${id}`);
      }
      const updatedTodos = todos.filter(todo => todo.id !== id && todo._id !== id);
      setTodos(updatedTodos);
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
    } catch (error) {
      console.error('Error deleting todo:', error);
      // Fallback to local delete
      const updatedTodos = todos.filter(todo => todo.id !== id);
      setTodos(updatedTodos);
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
    }
  };

  return (
    <div className="todo-window">
      <div className="window-header">
        <div className="traffic-lights">
          <div className="traffic-light close" onClick={onClose}></div>
          <div className="traffic-light minimize"></div>
          <div className="traffic-light expand"></div>
        </div>
        <div className="window-title">Todo List</div>
      </div>

      <div className="todo-content">
        <form className="todo-form" onSubmit={addTodo}>
          <input
            type="text"
            className="todo-input"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            disabled={isSubmitting}
            autoFocus
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="todo-priority-select"
            disabled={isSubmitting}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button 
            type="submit" 
            className="todo-add-btn"
            disabled={isSubmitting || !newTodo.trim()}
          >
            {isSubmitting ? 'Adding...' : 'Add'}
          </button>
        </form>

        <div className="todo-list">
          {todos.map(todo => (
            <div key={todo._id || todo.id} className="todo-item">
              <input
                type="checkbox"
                className="todo-checkbox"
                checked={todo.status === 'completed'}
                onChange={() => toggleTodo(todo._id || todo.id, todo.status)}
              />
              <span className={`todo-text ${todo.status === 'completed' ? 'completed' : ''}`}>
                {todo.title}
              </span>
              <div className="todo-actions">
                <span className={`todo-priority priority-${todo.priority}`}>
                  {todo.priority}
                </span>
                <button
                  className="todo-delete"
                  onClick={() => deleteTodo(todo._id || todo.id)}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Todo;