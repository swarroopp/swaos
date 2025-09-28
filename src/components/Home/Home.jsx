import React, { useState, useEffect, useRef } from 'react';
import MusicPlayer from '../Music/MusicPlayer';
import './Home.css';

const Home = () => {
  // PUT YOUR OPENWEATHERMAP API KEY HERE
  const WEATHER_API_KEY = '9f6dd828b10412b99ae302e90267031a'; // Replace with your actual API key
  const WEATHER_CITY = 'Khammam,IN'; // You can change this to your preferred city
  
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState({
    temp: '--',
    description: 'Loading...',
    icon: '🌤️',
    humidity: '--',
    windSpeed: '--',
    feelsLike: '--'
  });
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });
  const [activeWindow, setActiveWindow] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [controlCenter, setControlCenter] = useState(false);
  const [searchSpotlight, setSearchSpotlight] = useState(false);
  const [menuDropdown, setMenuDropdown] = useState(null);
  const [dockHover, setDockHover] = useState(-1);
  const [isMusicPlayerOpen, setIsMusicPlayerOpen] = useState(false);
  const dockRef = useRef(null);

  const handleDockIconClick = (appName) => {
    console.log('Dock icon clicked:', appName);
    switch (appName) {
      case 'music':
        console.log('Opening music player');
        setIsMusicPlayerOpen(true);
        break;
      case 'todo':
        // Handle todo click
        break;
      case 'journal':
        // Handle journal click
        break;
      case 'chrome':
        window.open('https://www.google.com', '_blank');
        break;
      case 'settings':
        // Handle settings click
        break;
      case 'calculator':
        // Handle calculator click
        break;
      default:
        break;
    }
  };

  // Fetch weather data
  const fetchWeather = async () => {
    try {
      if (WEATHER_API_KEY === 'your_api_key_here') {
        // Demo data when API key is not set
        setWeather({
          temp: '24',
          description: 'Partly Cloudy',
          icon: '⛅',
          humidity: '65',
          windSpeed: '12',
          feelsLike: '27'
        });
        return;
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${WEATHER_CITY}&appid=${WEATHER_API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Weather data not available');
      }
      
      const data = await response.json();
      
      // Weather icon mapping
      const getWeatherIcon = (iconCode) => {
        const iconMap = {
          '01d': '☀️', '01n': '🌙',
          '02d': '⛅', '02n': '☁️',
          '03d': '☁️', '03n': '☁️',
          '04d': '☁️', '04n': '☁️',
          '09d': '🌧️', '09n': '🌧️',
          '10d': '🌦️', '10n': '🌧️',
          '11d': '⛈️', '11n': '⛈️',
          '13d': '🌨️', '13n': '🌨️',
          '50d': '🌫️', '50n': '🌫️'
        };
        return iconMap[iconCode] || '🌤️';
      };
      
      setWeather({
        temp: Math.round(data.main.temp),
        description: data.weather[0].description
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        icon: getWeatherIcon(data.weather[0].icon),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        feelsLike: Math.round(data.main.feels_like)
      });
    } catch (error) {
      console.error('Error fetching weather:', error);
      setWeather({
        temp: '--',
        description: 'Weather unavailable',
        icon: '🌤️',
        humidity: '--',
        windSpeed: '--',
        feelsLike: '--'
      });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    // Fetch weather data on component mount and then every 10 minutes
    fetchWeather();
    const weatherTimer = setInterval(fetchWeather, 10 * 60 * 1000);
    
    return () => {
      clearInterval(timer);
      clearInterval(weatherTimer);
    };
  }, []);

  const formatTime = (date) => {
    const options = { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false // Use 24-hour format like macOS
    };
    return date.toLocaleTimeString([], options);
  };

  const formatDate = (date) => {
    return {
      dayName: date.toLocaleDateString('en', { weekday: 'long' }),
      monthYear: date.toLocaleDateString('en', { month: 'long', year: 'numeric' }),
      dayNumber: date.getDate(),
      shortDate: date.toLocaleDateString('en', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })
    };
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleClick = (e) => {
    if (contextMenu.show) {
      setContextMenu({ ...contextMenu, show: false });
    }
    if (controlCenter && !e.target.closest('.control-center')) {
      setControlCenter(false);
    }
    if (searchSpotlight && !e.target.closest('.spotlight-search')) {
      setSearchSpotlight(false);
    }
    if (menuDropdown && !e.target.closest('.menu-dropdown')) {
      setMenuDropdown(null);
    }
  };

  const openApp = (appName) => {
    setActiveWindow(appName);
    console.log(`Opening ${appName}...`);
  };

  const toggleControlCenter = () => {
    setControlCenter(!controlCenter);
  };

  const toggleSpotlight = () => {
    setSearchSpotlight(!searchSpotlight);
  };

  const apps = [
    { name: 'music', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Apple_Music_icon_iOS_26.svg', label: 'Apple Music' },
    { name: 'todo', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Microsoft_To-Do_icon.svg', label: 'To Do' },
    { name: 'journal', iconUrl: 'https://i.postimg.cc/fTNxw0kB/diary.png', label: 'Journal' },
    { name: 'chrome', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg', label: 'Google Chrome' },
    { name: 'settings', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Settings_%28iOS%29.png', label: 'Settings' },
    { name: 'calculator', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Calculator_SVG_Vector.svg', label: 'Calculator' }
  ];

  const getDockItemStyle = (index) => {
    const distance = Math.abs(index - dockHover);
    let scale = 1;
    let translateY = 0;

    if (dockHover !== -1) {
      if (distance === 0) {
        scale = 1.6;
        translateY = -20;
      } else if (distance === 1) {
        scale = 1.3;
        translateY = -12;
      } else if (distance === 2) {
        scale = 1.1;
        translateY = -6;
      }
    }

    return {
      transform: `scale(${scale}) translateY(${translateY}px)`,
      zIndex: distance === 0 ? 100 : 50 - distance
    };
  };

  useEffect(() => {
    const handleDocumentClick = (e) => {
      handleClick(e);
    };

    const handleKeyDown = (e) => {
      if (e.metaKey && e.key === ' ') {
        e.preventDefault();
        toggleSpotlight();
      }
    };

    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [contextMenu.show, controlCenter, searchSpotlight, menuDropdown]);

  return (
    <div className="home-container" onContextMenu={handleContextMenu} onClick={handleClick}>
      {/* Background */}
      <div className="desktop-background">
        <div className="bg-gradient"></div>
        <div className="bg-pattern"></div>
      </div>

      {/* Menu Bar */}
      <div className="menu-bar">
        <div className="menu-left">
          <div className="apple-logo">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M12.367 8.087c-.02-2.006 1.637-2.972 1.71-3.019-.932-1.363-2.383-1.55-2.9-1.57-1.234-.125-2.41.727-3.037.727-.627 0-1.595-.709-2.618-.69-1.348.02-2.59.783-3.283 1.99-1.398 2.427-.358 6.025 1.005 7.992.667.963 1.46 2.046 2.505 2.008 1.005-.04 1.385-.65 2.6-.65 1.214 0 1.556.65 2.618.63 1.082-.02 1.767-.984 2.428-1.95.765-1.118 1.08-2.2 1.099-2.257-.024-.01-2.108-.808-2.127-3.21zM10.52 3.782c.554-.672.927-1.606.825-2.537-.797.032-1.76.53-2.33 1.198-.512.593-.96 1.54-.84 2.45.89.07 1.798-.453 2.345-1.11z"/>
            </svg>
          </div>
          <div className="menu-items">
            <span onMouseEnter={() => setMenuDropdown('finder')}>Finder</span>
            <span>File</span>
            <span>Edit</span>
            <span>View</span>
            <span>Go</span>
            <span>Window</span>
            <span>Help</span>
          </div>
        </div>
        <div className="menu-right">
          <div className="system-icons">
            <div className="time-display" onClick={toggleControlCenter}>
              {formatTime(time)}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Area */}
      <div className="desktop-area">
        <div className="desktop-widgets">
        </div>

        {/* Widgets/Dashboard */}
        <div className="desktop-widgets">
          <div className="widget weather-widget">
            <div className="widget-header">
              <span>Weather</span>
              <button className="refresh-btn" onClick={fetchWeather} title="Refresh weather">
                🔄
              </button>
            </div>
            <div className="widget-content">
              <div className="weather-main">
                <div className="weather-icon">{weather.icon}</div>
                <div className="weather-temp">
                  <span className="temperature">{weather.temp}°C</span>
                  <div className="feels-like">Feels like {weather.feelsLike}°C</div>
                </div>
              </div>
              <div className="weather-description">{weather.description}</div>
              <div className="weather-details">
                <div className="weather-detail">
                  <span className="detail-icon">💧</span>
                  <span>{weather.humidity}%</span>
                </div>
                <div className="weather-detail">
                  <span className="detail-icon">💨</span>
                  <span>{weather.windSpeed} km/h</span>
                </div>
              </div>
              <div className="location">{WEATHER_CITY.split(',')[0]}</div>
            </div>
          </div>
          
          <div className="widget calendar-widget">
            <div className="widget-header">Today</div>
            <div className="widget-content">
              <div className="calendar-main">
                <div className="date-large">{formatDate(time).dayNumber}</div>
                <div className="date-info">
                  <div className="day-name">{formatDate(time).dayName}</div>
                  <div className="month-year">{formatDate(time).monthYear}</div>
                  <div className="current-time">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                </div>
              </div>
              <div className="quick-events">
                <div className="event-item">
                  <div className="event-time">10:00 AM</div>
                  <div className="event-title">Team Meeting</div>
                </div>
                <div className="event-item">
                  <div className="event-time">2:30 PM</div>
                  <div className="event-title">Project Review</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spotlight Search */}
      {searchSpotlight && (
        <div className="spotlight-search">
          <div className="spotlight-container">
            <div className="search-input-container">
              <div className="search-icon">🔍</div>
              <input 
                type="text" 
                placeholder="Spotlight Search"
                autoFocus
                className="search-input"
              />
            </div>
            <div className="search-results">
              <div className="search-result">
                <div className="result-icon">📱</div>
                <div className="result-info">
                  <div className="result-name">Calculator</div>
                  <div className="result-type">Application</div>
                </div>
              </div>
              <div className="search-result">
                <div className="result-icon">🎵</div>
                <div className="result-info">
                  <div className="result-name">Music</div>
                  <div className="result-type">Application</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Control Center */}
      {controlCenter && (
        <div className="control-center">
          <div className="control-grid">
            <div className="control-item wifi">
              <div className="control-icon">📶</div>
              <div className="control-label">Wi-Fi</div>
            </div>
            <div className="control-item bluetooth">
              <div className="control-icon">📡</div>
              <div className="control-label">Bluetooth</div>
            </div>
            <div className="control-item dnd">
              <div className="control-icon">🌙</div>
              <div className="control-label">Do Not Disturb</div>
            </div>
            <div className="control-item brightness">
              <div className="control-icon">☀️</div>
              <div className="control-slider">
                <input type="range" min="0" max="100" defaultValue="75" />
              </div>
            </div>
            <div className="control-item volume">
              <div className="control-icon">🔊</div>
              <div className="control-slider">
                <input type="range" min="0" max="100" defaultValue="60" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu.show && (
        <div 
          className="context-menu" 
          style={{ 
            left: contextMenu.x, 
            top: contextMenu.y 
          }}
        >
          <div className="context-menu-item">New Folder</div>
          <div className="context-menu-item">Get Info</div>
          <div className="context-menu-separator"></div>
          <div className="context-menu-item">Change Desktop Background</div>
          <div className="context-menu-item">Use Stacks</div>
          <div className="context-menu-separator"></div>
          <div className="context-menu-item">Sort By</div>
          <div className="context-menu-item">Clean Up</div>
          <div className="context-menu-item">Show View Options</div>
        </div>
      )}

      {/* Dock */}
      <div className="dock">
        <div 
          className="dock-container"
          ref={dockRef}
          onMouseLeave={() => setDockHover(-1)}
        >
          {apps.map((app, index) => (
            <div
              key={app.name}
              className="dock-item"
              style={getDockItemStyle(index)}
              onMouseEnter={() => setDockHover(index)}
              onClick={() => openApp(app.name)}
              title={app.label}
            >
              <div className="dock-icon">
                <img src={app.iconUrl} alt={app.label} className="dock-icon-image" />
              </div>
              {app.name === 'music' && <div className="running-indicator"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Music Player */}
      {/* Dock */}
      <div className="dock">
        <div className="dock-container">
          <button className="dock-item" onClick={() => handleDockIconClick('music')}>
            <div className="dock-icon">
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/f8/Apple_Music_icon_iOS_26.svg" 
                   alt="Music" 
                   className="dock-icon-image" />
            </div>
          </button>
          <button className="dock-item" onClick={() => handleDockIconClick('todo')}>
            <div className="dock-icon">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6e/Microsoft_To-Do_icon.svg" 
                   alt="Todo" 
                   className="dock-icon-image" />
            </div>
          </button>
          <button className="dock-item" onClick={() => handleDockIconClick('journal')}>
            <div className="dock-icon">
              <img src="https://i.postimg.cc/fTNxw0kB/diary.png" 
                   alt="Journal" 
                   className="dock-icon-image" />
            </div>
          </button>
          <button className="dock-item" onClick={() => handleDockIconClick('chrome')}>
            <div className="dock-icon">
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg" 
                   alt="Chrome" 
                   className="dock-icon-image" />
            </div>
          </button>
          <button className="dock-item" onClick={() => handleDockIconClick('settings')}>
            <div className="dock-icon">
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/ea/Settings_%28iOS%29.png" 
                   alt="Settings" 
                   className="dock-icon-image" />
            </div>
          </button>
          <button className="dock-item" onClick={() => handleDockIconClick('calculator')}>
            <div className="dock-icon">
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/9e/Calculator_SVG_Vector.svg" 
                   alt="Calculator" 
                   className="dock-icon-image" />
            </div>
          </button>
        </div>
      </div>

      {/* Music Player Modal */}
      <MusicPlayer 
        isOpen={isMusicPlayerOpen} 
        onClose={() => setIsMusicPlayerOpen(false)} 
      />
    </div>
  );
};

export default Home;