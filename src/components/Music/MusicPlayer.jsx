import React from 'react';
import './MusicPlayer.css';

const MusicPlayer = ({ isOpen, onClose, service = 'apple' }) => {
  if (!isOpen) return null;

  const getIframeContent = () => {
    switch (service) {
      case 'apple':
        return (
          <iframe 
            allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" 
            frameBorder="0" 
            height="450" 
            style={{
              width: '100%',
              maxWidth: '660px',
              overflow: 'hidden',
              borderRadius: '10px',
            }}
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" 
            src="https://embed.music.apple.com/in/playlist/favorite-songs/pl.u-pZU5WBEbxa"
          />
        );
      case 'google':
        return (
          <iframe 
            allow="autoplay; encrypted-media; fullscreen; clipboard-write" 
            frameBorder="0" 
            height="450" 
            style={{
              width: '100%',
              maxWidth: '660px',
              overflow: 'hidden',
              borderRadius: '10px',
            }}
            src="https://music.youtube.com/embed/playlist?list=PLRM9d9QUTwYK6hKvGDA5lNc_APw4HAZS2"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="music-player-overlay" onClick={onClose}>
      <div className="music-player-modal" onClick={e => e.stopPropagation()}>
        <div className="music-player-header">
          <div className="music-player-title">{service === 'apple' ? 'Apple Music' : 'YouTube Music'}</div>
          <button className="close-button" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14">
              <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" 
                    fill="currentColor"/>
            </svg>
          </button>
        </div>
        <div className="music-player-content">
          {getIframeContent()}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
