import React, { useState, useEffect, useRef } from 'react';
import './Settings.css';

const Settings = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState('general');
  const [theme, setTheme] = useState({
    mode: 'dark',
    accentColor: '#007AFF',
    transparency: 0.8,
    blur: 20,
  });
  const [sound, setSound] = useState({
    volume: 75,
    effects: true,
    startup: true
  });
  const [display, setDisplay] = useState({
    brightness: 80,
    nightMode: false,
    autoAdjust: true
  });
  const [notifications, setNotifications] = useState({
    enabled: true,
    sound: true,
    badges: true
  });
  const [accessibility, setAccessibility] = useState({
    reduceMotion: false,
    increaseContrast: false,
    fontSize: 'medium'
  });
  const modalRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    // Apply theme changes to the entire app
    document.documentElement.style.setProperty('--accent-color', theme.accentColor);
    document.documentElement.style.setProperty('--app-transparency', theme.transparency);
    document.documentElement.style.setProperty('--app-blur', `${theme.blur}px`);
    document.documentElement.setAttribute('data-theme', theme.mode);
  }, [theme]);

  const handleMouseDown = (e) => {
    if (e.target.closest('.traffic-lights') || e.target.closest('.settings-content')) {
      return;
    }
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const sections = {
    general: {
      title: 'General',
      icon: '⚙️',
      content: (
        <div className="settings-section">
          <h3>Theme Customization</h3>
          <div className="setting-item">
            <label>Theme Mode</label>
            <select 
              value={theme.mode}
              onChange={(e) => setTheme(prev => ({ ...prev, mode: e.target.value }))}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div className="setting-item">
            <label>Accent Color</label>
            <input 
              type="color" 
              value={theme.accentColor}
              onChange={(e) => setTheme(prev => ({ ...prev, accentColor: e.target.value }))}
            />
          </div>
          <div className="setting-item">
            <label>Transparency ({Math.round(theme.transparency * 100)}%)</label>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1"
              value={theme.transparency}
              onChange={(e) => setTheme(prev => ({ ...prev, transparency: e.target.value }))}
            />
          </div>
          <div className="setting-item">
            <label>Blur Effect ({theme.blur}px)</label>
            <input 
              type="range" 
              min="0" 
              max="40" 
              value={theme.blur}
              onChange={(e) => setTheme(prev => ({ ...prev, blur: e.target.value }))}
            />
          </div>
        </div>
      )
    },
    sound: {
      title: 'Sound',
      icon: '🔊',
      content: (
        <div className="settings-section">
          <h3>Sound Settings</h3>
          <div className="setting-item">
            <label>Volume ({sound.volume}%)</label>
            <input 
              type="range" 
              min="0" 
              max="100"
              value={sound.volume}
              onChange={(e) => setSound(prev => ({ ...prev, volume: e.target.value }))}
            />
          </div>
          <div className="setting-item">
            <label>Sound Effects</label>
            <div className="toggle">
              <input 
                type="checkbox" 
                checked={sound.effects}
                onChange={(e) => setSound(prev => ({ ...prev, effects: e.target.checked }))}
              />
              <span className="toggle-slider"></span>
            </div>
          </div>
          <div className="setting-item">
            <label>Startup Sound</label>
            <div className="toggle">
              <input 
                type="checkbox" 
                checked={sound.startup}
                onChange={(e) => setSound(prev => ({ ...prev, startup: e.target.checked }))}
              />
              <span className="toggle-slider"></span>
            </div>
          </div>
        </div>
      )
    },
    display: {
      title: 'Display',
      icon: '🖥️',
      content: (
        <div className="settings-section">
          <h3>Display Settings</h3>
          <div className="setting-item">
            <label>Brightness ({display.brightness}%)</label>
            <input 
              type="range" 
              min="0" 
              max="100"
              value={display.brightness}
              onChange={(e) => setDisplay(prev => ({ ...prev, brightness: e.target.value }))}
            />
          </div>
          <div className="setting-item">
            <label>Night Mode</label>
            <div className="toggle">
              <input 
                type="checkbox" 
                checked={display.nightMode}
                onChange={(e) => setDisplay(prev => ({ ...prev, nightMode: e.target.checked }))}
              />
              <span className="toggle-slider"></span>
            </div>
          </div>
          <div className="setting-item">
            <label>Auto Brightness</label>
            <div className="toggle">
              <input 
                type="checkbox" 
                checked={display.autoAdjust}
                onChange={(e) => setDisplay(prev => ({ ...prev, autoAdjust: e.target.checked }))}
              />
              <span className="toggle-slider"></span>
            </div>
          </div>
        </div>
      )
    },
    notifications: {
      title: 'Notifications',
      icon: '🔔',
      content: (
        <div className="settings-section">
          <h3>Notification Settings</h3>
          <div className="setting-item">
            <label>Enable Notifications</label>
            <div className="toggle">
              <input 
                type="checkbox" 
                checked={notifications.enabled}
                onChange={(e) => setNotifications(prev => ({ ...prev, enabled: e.target.checked }))}
              />
              <span className="toggle-slider"></span>
            </div>
          </div>
          <div className="setting-item">
            <label>Notification Sound</label>
            <div className="toggle">
              <input 
                type="checkbox" 
                checked={notifications.sound}
                onChange={(e) => setNotifications(prev => ({ ...prev, sound: e.target.checked }))}
              />
              <span className="toggle-slider"></span>
            </div>
          </div>
          <div className="setting-item">
            <label>Badge Icons</label>
            <div className="toggle">
              <input 
                type="checkbox" 
                checked={notifications.badges}
                onChange={(e) => setNotifications(prev => ({ ...prev, badges: e.target.checked }))}
              />
              <span className="toggle-slider"></span>
            </div>
          </div>
        </div>
      )
    },
    accessibility: {
      title: 'Accessibility',
      icon: '👥',
      content: (
        <div className="settings-section">
          <h3>Accessibility Settings</h3>
          <div className="setting-item">
            <label>Reduce Motion</label>
            <div className="toggle">
              <input 
                type="checkbox" 
                checked={accessibility.reduceMotion}
                onChange={(e) => setAccessibility(prev => ({ ...prev, reduceMotion: e.target.checked }))}
              />
              <span className="toggle-slider"></span>
            </div>
          </div>
          <div className="setting-item">
            <label>Increase Contrast</label>
            <div className="toggle">
              <input 
                type="checkbox" 
                checked={accessibility.increaseContrast}
                onChange={(e) => setAccessibility(prev => ({ ...prev, increaseContrast: e.target.checked }))}
              />
              <span className="toggle-slider"></span>
            </div>
          </div>
          <div className="setting-item">
            <label>Font Size</label>
            <select 
              value={accessibility.fontSize}
              onChange={(e) => setAccessibility(prev => ({ ...prev, fontSize: e.target.value }))}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="extra-large">Extra Large</option>
            </select>
          </div>
        </div>
      )
    }
  };

  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div 
        className="settings-modal" 
        onClick={e => e.stopPropagation()}
        ref={modalRef}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`
        }}
      >
        <div className="settings-header" onMouseDown={handleMouseDown}>
          <div className="traffic-lights">
            <button className="traffic-light close" onClick={onClose} title="Close"></button>
            <button className="traffic-light minimize" title="Minimize"></button>
            <button className="traffic-light maximize" title="Maximize"></button>
          </div>
          <span className="window-title">Settings</span>
        </div>
        <div className="settings-container">
          <div className="settings-sidebar">
            {Object.entries(sections).map(([key, section]) => (
              <div
                key={key}
                className={`sidebar-item ${activeSection === key ? 'active' : ''}`}
                onClick={() => setActiveSection(key)}
              >
                <span className="sidebar-icon">{section.icon}</span>
                <span className="sidebar-text">{section.title}</span>
              </div>
            ))}
          </div>
          <div className="settings-content">
            {sections[activeSection].content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;