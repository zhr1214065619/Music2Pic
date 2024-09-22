import {useSelector} from "react-redux";
import {Button} from "react-bootstrap";
import {changeShowText, resetProgress} from "../../../store/modules/music.ts";
import {RootState, useAppDispatch} from "../../../store/store.ts";
import UploadMusicButton from "../UploadMusicButton/UploadMusic.tsx";
import StartGenerateButton from "../StartGenerateButton/StartGenerateButton.tsx";

const ButtonSet = () => {
  const dispatch = useAppDispatch();
  const progress = useSelector((state: RootState) => state.music.progress);
  const showText = useSelector((state: RootState) => state.music.showText);
  if (progress == 0) {
    return (<UploadMusicButton/>);
  } else if (progress == 2) {
    return (
      <>
        <StartGenerateButton />
        <Button variant="dark" onClick={() => dispatch(resetProgress())}>リセット</Button>
      </>);
  } else if (progress == 5) {
    return (
      <>
        <Button onClick={() => dispatch(changeShowText())} style={{ marginRight: "10px"}} variant="dark">{showText ? "画像表示" : "文字表示"}</Button>
        <Button onClick={() => dispatch(resetProgress())} variant="dark">リセット</Button>
      </>

    )
  }
  return (<Button variant="dark" onClick={() => dispatch(resetProgress())}>リセット</Button>)
}

export default ButtonSet;
