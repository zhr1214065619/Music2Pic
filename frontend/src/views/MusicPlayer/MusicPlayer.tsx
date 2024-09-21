import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const MusicPlayer = () => {

  const progress = useSelector((state: RootState) => state.music.progress);
  const musicFileUrl = useSelector((state: RootState) => state.music.musicFileUrl);

  if (progress < 2) {
    return (
      <></>
    );
  }

  return (
    <AudioPlayer
      autoPlay
      src={musicFileUrl}
    />
  );
};

export default MusicPlayer;