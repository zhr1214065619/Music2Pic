import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Markdown from 'react-markdown'

const TextDisplay = () => {
  const progress = useSelector((state: RootState) => state.music.progress);
  const textInfo = useSelector((state: RootState) => state.music.text);
  const showText = useSelector((state: RootState) => state.music.showText);

  if (progress == 5 && showText) {
    return (
      <div style={{ textAlign: "left", height: "50vh", overflow: "auto"}}>
        <Markdown>{textInfo}</Markdown>
      </div>
    );
  }

  return (
    <></>
  );
};

export default TextDisplay;