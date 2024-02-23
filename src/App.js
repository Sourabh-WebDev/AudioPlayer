import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // State variables to manage playlist and current track index
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // useEffect to load playlist and current track index from localStorage on initial render
  useEffect(() => {
    // Retrieve playlist and current track index from localStorage
    const storedPlaylist = JSON.parse(localStorage.getItem('playlist'));
    const storedIndex = parseInt(localStorage.getItem('currentTrackIndex'));

    // Set playlist and current track index if they exist in localStorage
    if (storedPlaylist && storedPlaylist.length > 0 && !isNaN(storedIndex)) {
      setPlaylist(storedPlaylist);
      setCurrentTrackIndex(storedIndex);
    }

    // Audio player related operations
    const audioPlayer = document.getElementById('audioPlayer');

    // Add event listener for time update to handle playback state
    audioPlayer?.addEventListener('timeupdate', handlePlaybackState);

    // Set current time if stored in localStorage
    const storedCurrentTime = parseFloat(localStorage.getItem('currentTime'));
    if (!isNaN(storedCurrentTime) && audioPlayer) {
      audioPlayer.currentTime = storedCurrentTime;
    }

    // Resume playback if it was paused before
    const isPaused = localStorage.getItem('isPaused');
    if (isPaused === 'false' && audioPlayer) {
      audioPlayer.play();
    }

    // Clean up function to remove event listener
    return () => {
      audioPlayer?.removeEventListener('timeupdate', handlePlaybackState);
    };
  }, []);

  // useEffect to store playlist and current track index in localStorage when they change
  useEffect(() => {
    localStorage.setItem('playlist', JSON.stringify(playlist));
  }, [playlist]);

  useEffect(() => {
    localStorage.setItem('currentTrackIndex', currentTrackIndex);
  }, [currentTrackIndex]);

  // Function to handle file change when user selects audio files
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPlaylist(files);
  };

  // Function to play the next track in the playlist
  const playNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  // Function to handle playback state and update localStorage
  const handlePlaybackState = (e) => {
    localStorage.setItem('isPaused', e.target.paused);
    localStorage.setItem('currentTime', e.target.currentTime);
  };

  return (
    <div className="app">
      {/* Header */}
      <h1 className="title">Audio Player</h1>

      {/* Input to upload audio files */}
      <input type="file" accept="audio/mp3" onChange={handleFileChange} multiple />

      {/* Playlist */}
      <div className="playlist-container">
        <h2>Playlist</h2>
        <ul className="playlist">
          {playlist.map((track, index) => (
            <li key={index}>
              {/* Button to select track from playlist */}
              <button className={`track-button ${index === currentTrackIndex ? 'active' : ''}`} onClick={() => setCurrentTrackIndex(index)}>
                {track.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Audio player */}
      {playlist.length > 0 && (
        <div className="player-container">
          <h2>Now Playing</h2>
          <audio
            controls
            autoPlay
            src={playlist[currentTrackIndex] && URL.createObjectURL(playlist[currentTrackIndex])}
            onEnded={playNextTrack}
            onTimeUpdate={handlePlaybackState}
            id="audioPlayer"
            className="audio-player"
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}

export default App;
