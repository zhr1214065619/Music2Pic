import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../store/store.ts";
import ProgressBar from 'react-bootstrap/ProgressBar';
import {Button} from "react-bootstrap";
import {resetProgress} from "../../store/modules/music.ts";
import UploadMusicButton from "./UploadMusicButton/UploadMusic.tsx";
import StartGenerateButton from "./StartGenerateButton/StartGenerateButton.tsx";

const StageBar = () => {
  const dispatch = useAppDispatch();
  const progress = useSelector((state: RootState) => state.music.progress);
  const message = useSelector((state: RootState) => state.music.message);
  const stageNumber = 20;
  return (
    <>
      <p>{message}</p>
      <ProgressBar animated now={progress * stageNumber > 0 ? progress * stageNumber : 0}
                   label={`${progress * stageNumber}%`} style={{marginBottom: '20px'}}/>
      {
        progress == 0 ? (
          <>
            <UploadMusicButton/>
          </>
        ) : (
          progress == 2 ? (
            <StartGenerateButton/>
          ) : (
            <Button onClick={() => dispatch(resetProgress())}>
              リセット
            </Button>
          )
        )
      }
    </>
  )
}

export default StageBar;
