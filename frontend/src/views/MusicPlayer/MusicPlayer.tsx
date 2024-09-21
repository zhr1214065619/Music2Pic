import { useRef } from 'react';
import Button from 'react-bootstrap/Button';
import {uploadMusic, convert2Text, generateImage} from "../../store/modules/music.ts";
import {useAppDispatch} from "../../store/store.ts"; // 导入Bootstrap按钮组件

const MusicPlayer = () => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      dispatch(uploadMusic({file: event.target.files[0]}))
        .then((response) => {
          // 假设response中包含了fileId
          const fileName = response.payload.fileName;
          dispatch(convert2Text({fileId: fileName}))
            .then((textResponse) => {
              const prompt = textResponse.payload.text;
              dispatch(generateImage({text: prompt}))
                .then((imageResponse) => {
                  console.log(imageResponse);
                });
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
