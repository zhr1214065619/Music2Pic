import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const ImageDisplay = () => {
  const progress = useSelector((state: RootState) => state.music.progress);
  const imageBase64 = useSelector((state: RootState) => state.music.base64image);
  const showText = useSelector((state: RootState) => state.music.showText);
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  if (progress === 5 && !showText) {
    return (
      <>
        <img
          src={`data:image/jpeg;base64,${imageBase64}`}
          alt="Music"
          style={{ maxHeight: '50vh', maxWidth: '100%' }}
          onClick={togglePopup}
        />
        {showPopup && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }} onClick={togglePopup}>
            <img
              src={`data:image/jpeg;base64,${imageBase64}`}
              alt="Music"
              style={{ maxHeight: '90vh', maxWidth: '90%' }}
            />
          </div>
        )}
      </>
    );
  }

  return <></>;
};

export default ImageDisplay;