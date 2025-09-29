import React from 'react';
import './GoogleFrame.css';

const GoogleFrame = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="google-overlay" onClick={onClose}>
      <div className="google-modal" onClick={e => e.stopPropagation()}>
        <div className="google-header">
          <div className="google-title">Google</div>
          <button className="close-button" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14">
              <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" 
                    fill="currentColor"/>
            </svg>
          </button>
        </div>
        <div className="google-content">
          <iframe
            src="https://www.google.com"
            title="Google"
            width="100%"
            height="600"
            style={{
              border: 'none',
              borderRadius: '10px',
            }}
            allow="fullscreen"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
          />
        </div>
      </div>
    </div>
  );
};

export default GoogleFrame;