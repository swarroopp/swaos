import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/variables.css';
import './styles/settings-effects.css';
import './styles/cursor.css';
import Home from './components/Home/Home';


function App() {
  return (
    <div className="app">
      <Home />
    </div>
  );
}

export default App;
