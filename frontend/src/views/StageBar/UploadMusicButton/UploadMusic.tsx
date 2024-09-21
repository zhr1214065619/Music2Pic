import { useRef } from 'react';
import Button from 'react-bootstrap/Button';
import {refreshMusic, uploadMusic} from "../../../store/modules/music.ts";
import {useAppDispatch} from "../../../store/store.ts";

const UploadMusicButton = () => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      dispatch(refreshMusic(URL.createObjectURL(event.target.files?.[0])));
      dispatch(uploadMusic({file: event.target.files?.[0]}));
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
      <Button onClick={handleClick} variant="primary" style={{ marginRight: "20px" }}>アップロード</Button>
    </>
  );
};

export default UploadMusicButton;
