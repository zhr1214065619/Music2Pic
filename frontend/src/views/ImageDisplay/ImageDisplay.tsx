import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const ImageDisplay = () => {

  const progress = useSelector((state: RootState) => state.music.progress);
  const imageBase64 = useSelector((state: RootState) => state.music.base64image);
  const showText = useSelector((state: RootState) => state.music.showText);

  if (progress == 5 && !showText) {
    return (
      <img src={`data:image/jpeg;base64,${imageBase64}`} alt="Music" style={{maxHeight: '50vh'}}/>
    );
  }

  return (
    <></>
  );
};

export default ImageDisplay;
