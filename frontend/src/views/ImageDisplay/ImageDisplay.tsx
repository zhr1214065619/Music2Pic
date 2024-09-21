import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const ImageDisplay = () => {

  const imageBase64 = useSelector((state: RootState) => state.music.base64image);

  return (
    <>
      {imageBase64 ? (
        <img src={`data:image/jpeg;base64,${imageBase64}`} alt="Music" style={{ maxWidth: '100%' }} />
      ) : (
        <p>No image available</p>
      )}
    </>
  );
};

export default ImageDisplay;
