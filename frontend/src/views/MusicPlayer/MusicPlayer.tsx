import { useRef } from 'react';
import Button from 'react-bootstrap/Button';
import {uploadMusic, convert2Text, generateImage} from "../../store/modules/music.ts";
import {useAppDispatch} from "../../store/store.ts";
import {Convert2TextOutDto, SaveMusicOutDto} from "../../model/dto/MusicDto.ts"; // 导入Bootstrap按钮组件

const MusicPlayer = () => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      dispatch(uploadMusic({file: event.target.files[0]}))
        .then((response) => {
          const fileName = (response.payload as SaveMusicOutDto).fileName;
          dispatch(convert2Text({fileId: fileName}))
            .then((textResponse) => {
              const prompt = (textResponse.payload as Convert2TextOutDto).text;
              dispatch(generateImage({text: prompt}));
            });
        });
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }} // 隐藏原生文件输入
      />
      <Button onClick={handleClick} variant="primary">アップロード</Button>
    </>
  );
};

export default MusicPlayer;
