import React, { useState, useEffect, useRef } from 'react';
import './GoogleSearch.css';

const GoogleSearch = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showPrompt, setShowPrompt] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const iframeRef = useRef(null);
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Ctrl/Cmd + L to clear search
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        setSearchQuery('');
        setShowPrompt(true);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsLoading(true);
      const encodedQuery = encodeURIComponent(searchQuery);
      
      // Add to search history
      setSearchHistory(prev => [searchQuery, ...prev.slice(0, 4)]);
      
      // Update iframe src
      if (iframeRef.current) {
        iframeRef.current.src = `https://www.google.com/search?igu=1&q=${encodedQuery}`;
      }
      setShowPrompt(false);
      setShowHistory(false);
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const selectHistoryItem = (query) => {
    setSearchQuery(query);
    setShowHistory(false);
    handleSearch({ preventDefault: () => {} });
  };

  if (!isOpen) return null;

  return (
    <div className="google-overlay" onClick={onClose}>
      <div className="google-modal" onClick={e => e.stopPropagation()} ref={modalRef}>
        <div className="google-header">
          <div className="google-logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 100" width="200" height="50">
            <text x="10" y="70" font-size="72" font-family="Arial, sans-serif" font-weight="bold">
                <tspan fill="#4285f4">S</tspan>
                <tspan fill="#ea4335">w</tspan>
                <tspan fill="#fbbc05">o</tspan>
                <tspan fill="#4285f4">g</tspan>
                <tspan fill="#34a853">l</tspan>
                <tspan fill="#ea4335">e</tspan>
            </text>
            </svg>
          </div>
          <button className="close-button" onClick={onClose} title="Close (Esc)">
            <svg width="14" height="14" viewBox="0 0 14 14">
              <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" 
                    fill="currentColor"/>
            </svg>
          </button>
        </div>
        <div className="google-content">
          {showPrompt ? (
            <div className="search-prompt">
              <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-wrapper">
                  <svg className="search-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="#9aa0a6" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowHistory(true);
                    }}
                    placeholder="Search Google or type a URL"
                    className="search-input"
                    autoFocus
                  />
                  {searchQuery && (
                    <button 
                      type="button" 
                      className="clear-button"
                      onClick={() => {
                        setSearchQuery('');
                        inputRef.current?.focus();
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
                <button type="submit" className="search-button">
                  Search
                </button>
              </form>
              {showHistory && searchHistory.length > 0 && (
                <div className="search-history">
                  {searchHistory.map((query, index) => (
                    <div 
                      key={index} 
                      className="history-item"
                      onClick={() => selectHistoryItem(query)}
                    >
                      <svg className="history-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path fill="#9aa0a6" d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                      </svg>
                      {query}
                    </div>
                  ))}
                </div>
              )}
              <div className="keyboard-shortcuts">
                <span>Press <kbd>Ctrl</kbd> + <kbd>K</kbd> to search</span>
                <span>Press <kbd>Ctrl</kbd> + <kbd>L</kbd> to clear</span>
                <span>Press <kbd>Esc</kbd> to close</span>
              </div>
            </div>
          ) : (
            <>
              {isLoading && <div className="loading-spinner" />}
              <iframe
                ref={iframeRef}
                id="google-search-frame"
                title="Google Search Results"
                width="100%"
                height="600"
                style={{
                  border: 'none',
                  borderRadius: '10px',
                  opacity: isLoading ? 0 : 1,
                  transition: 'opacity 0.3s ease'
                }}
                allow="fullscreen"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
                src={`https://www.google.com/search?igu=1&q=${encodeURIComponent(searchQuery)}`}
                onLoad={handleIframeLoad}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleSearch;