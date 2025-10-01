import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Todo.css';

const Todo = ({ onClose, settingsBrightness }) => {
  // Update brightness when settings change
  useEffect(() => {
    if (typeof settingsBrightness === 'number') {
      setBrightness(settingsBrightness);
    }
  }, [settingsBrightness]);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isBackendAvailable, setIsBackendAvailable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [position, setPosition] = useState(() => {
    // Calculate initial center position
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const windowWidth = 400; // Width of todo window
    const windowHeight = 500; // Height of todo window
    return {
      x: (viewportWidth - windowWidth) / 2,
      y: (viewportHeight - windowHeight) / 2
    };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [brightness, setBrightness] = useState(() => {
    // Get saved brightness or default to 100
    return parseInt(localStorage.getItem('todo-brightness') || '100');
  });

  // Effect to save brightness to localStorage
  useEffect(() => {
    localStorage.setItem('todo-brightness', brightness.toString());
  }, [brightness]);

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.window-header')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  }, [position]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    let mounted = true;
    const fetchTodos = async () => {
      if (!mounted) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:5000/api/todos');
        if (!mounted) return;
        setTodos(response.data);
        setIsBackendAvailable(true);
      } catch (error) {
        if (!mounted) return;
        console.error('Error fetching todos:', error);
        setIsBackendAvailable(false);
        setError('Failed to connect to server. Using offline mode.');
        const localTodos = localStorage.getItem('todos');
        if (localTodos) {
          setTodos(JSON.parse(localTodos));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTodos();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadTodos = async () => {
      if (!mounted) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:5000/api/todos');
        if (!mounted) return;
        setTodos(response.data);
        setIsBackendAvailable(true);
      } catch (error) {
        if (!mounted) return;
        console.error('Error fetching todos:', error);
        setIsBackendAvailable(false);
        setError('Failed to connect to server. Using offline mode.');
        const localTodos = localStorage.getItem('todos');
        if (localTodos) {
          setTodos(JSON.parse(localTodos));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    loadTodos();
    return () => {
      mounted = false;
    };
  }, []);

  const fetchTodos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/todos');
      setTodos(response.data);
      setIsBackendAvailable(true);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setIsBackendAvailable(false);
      setError('Failed to connect to server. Using offline mode.');
      // Use local storage as fallback
      const localTodos = localStorage.getItem('todos');
      if (localTodos) {
        setTodos(JSON.parse(localTodos));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);
    
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
    <div 
      className="todo-window"
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'none',
        cursor: isDragging ? 'grabbing' : 'auto',
        filter: `brightness(${brightness}%)`,
        transition: 'filter 0.3s ease'
      }}
      onMouseDown={handleMouseDown}
    >
        <div className="window-header">
          <div className="traffic-lights">
            <div className="traffic-light close" onClick={onClose}></div>
            <div className="traffic-light minimize"></div>
            <div className="traffic-light expand"></div>
          </div>
          <div className="window-title">Todo List {!isBackendAvailable && '(Offline)'}</div>
        </div>
        <div className="todo-content">
          {error && (
            <div className="error-message">
              {error}
              <button onClick={fetchTodos} className="retry-button">Retry</button>
            </div>
          )}
          <div className="todo-main-content" style={{ opacity: isLoading ? 0.5 : 1, pointerEvents: isLoading ? 'none' : 'auto' }}>
            {isLoading && <div className="loading-spinner" />}
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
      </div>
  );
};

export default Todo;