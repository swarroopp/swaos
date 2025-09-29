import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

const defaultSettings = {
  theme: 'light',
  fontSize: 16,
  transparency: 0.85,
  soundEffects: true,
  notifications: true,
  animations: true,
  showBattery: true,
  showDate: true,
  showTime: true,
  language: 'en',
  accentColor: '#007AFF',
  wallpaper: 'default',
  dockSize: 'medium',
  dockMagnification: true
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('userSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  useEffect(() => {
    // Apply settings to document
    document.documentElement.style.setProperty('--font-size', `${settings.fontSize}px`);
    document.documentElement.style.setProperty('--transparency', settings.transparency);
    document.documentElement.style.setProperty('--accent-color', settings.accentColor);
    document.documentElement.setAttribute('data-theme', settings.theme);
    
    // Save settings to localStorage
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}