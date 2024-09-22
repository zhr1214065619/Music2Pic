import {useSelector} from "react-redux";
import {RootState} from "../../store/store.ts";
import ProgressBar from 'react-bootstrap/ProgressBar';
import ButtonSet from "./ButtonSet/ButtonSet.tsx";

const StageBar = () => {
  const progress = useSelector((state: RootState) => state.music.progress);
  const message = useSelector((state: RootState) => state.music.message);
  const stageNumber = 20;
  return (
    <>
      <p>{message}</p>
      <ProgressBar animated variant="dark" now={progress * stageNumber > 0 ? progress * stageNumber : 0}
                   label={`${progress * stageNumber}%`} style={{marginBottom: '10px'}}/>
      <ButtonSet />
    </>
  )
}

export default StageBar;
