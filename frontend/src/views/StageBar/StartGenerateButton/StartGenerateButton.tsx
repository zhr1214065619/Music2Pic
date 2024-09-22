import Button from 'react-bootstrap/Button';
import {convert2Text, generateImage} from "../../../store/modules/music.ts";
import {RootState, useAppDispatch} from "../../../store/store.ts";
import {Convert2TextOutDto} from "../../../model/dto/MusicDto.ts";
import {useSelector} from "react-redux"; // 导入Bootstrap按钮组件

const UploadMusicButton = () => {
  const dispatch = useAppDispatch();
  const musicFileUrl = useSelector((state: RootState) => state.music.musicFileUrl);

  const handleClick = () => {
    if (musicFileUrl) {
      dispatch(convert2Text({fileUrl: musicFileUrl}))
        .then((textResponse) => {
          dispatch(generateImage(textResponse.payload as Convert2TextOutDto));
        });
    }
  };

  return (
    <>
      <Button onClick={handleClick} variant="dark" style={{ marginRight: "10px"}}>画像生成</Button>
    </>
  );
};

export default UploadMusicButton;
