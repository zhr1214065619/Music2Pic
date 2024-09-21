import {useSelector} from "react-redux";
import {RootState} from "../../store/store.ts";
import ProgressBar from 'react-bootstrap/ProgressBar';

const StageBar = () => {
  const progress = useSelector((state: RootState) => state.music.progress);
  const stageNumber = 25;
  const getLabel = (progress: number) => {
    switch (progress) {
      case 0: return `ファイルをアップロードしてください`
      case 1: return `アップロード中`
      case 2: return `音楽解析中`
      case 3: return `画像生成中`
      case 4: return `生成完了しました`
      case -1: return `失敗しました。再アップロードしてください`
    }
  }
  return (
    <>
      <p>{getLabel(progress)}</p>
      <ProgressBar animated now={progress * stageNumber>0 ? progress * stageNumber : 0 } label={`${progress * stageNumber}%`}/>
    </>
  );
}

export default StageBar;
