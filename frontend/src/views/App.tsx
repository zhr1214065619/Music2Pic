import { useState } from 'react';
import viteLogo from '/vite.svg';
import './App.css';
import { RootState, useAppDispatch } from "../store/store";
import { useSelector } from "react-redux";
import { fetchMusic } from "../store/modules/music";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

function App() {
  const dispatch = useAppDispatch();
  const message = useSelector((state: RootState) => state.music.message);
  const requestTimes = useSelector((state: RootState) => state.music.requestTime);
  const [userId, setUserId] = useState("");

  function handleCategChange() {
    dispatch(fetchMusic({ id: userId }));
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUserId(event.target.value);
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <input
          type="text"
          value={userId}
          onChange={handleInputChange}
          placeholder="Enter user ID"
        />
        <button onClick={handleCategChange}>
          count is {requestTimes}
        </button>
        <p>{message}</p>
        <p>{userId}</p>
      </div>
      <AudioPlayer
        autoPlay
        src="http://example.com/audio.mp3"
        onPlay={e => console.log("onPlay")}
        // other props here
      />
    </>
  );
}

export default App;