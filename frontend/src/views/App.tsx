import './App.css';
import { useAppDispatch } from "../store/store";
import { updateProgress } from "../store/modules/music";
import 'react-h5-audio-player/lib/styles.css';
import StageBar from "./ProgressBar/ProgressBar.tsx";
import {Button} from "react-bootstrap";
import { Container, Row, Col } from 'react-bootstrap';
import MusicPlayer from "./MusicPlayer/MusicPlayer.tsx";
import ImageDisplay from "./ImageDisplay/ImageDisplay.tsx";

function App() {
  const dispatch = useAppDispatch();

  const onClick = () => {
    const stage = Math.floor(Math.random() * 4) + 1;
    dispatch(updateProgress(stage));
  }
  return (
    <>
      <h1>Music2Pic</h1>
      <Container fluid>
        {/* 进度条 */}
        <Row>
          <Col>
            <StageBar />
            <Button onClick={onClick}> check </Button>
          </Col>
        </Row>

        {/* 主体布局 */}
        <Row>
          {/* 左侧区域 */}
          <Col md={6}>
            {/* 音乐播放器 */}
            <Row>
              <Col>
                <div style={{ height: '30vh', background: '#f0f0f0' }}>
                  {/* 音乐播放器组件 */}
                  Music Player
                  <MusicPlayer />
                </div>

              </Col>
            </Row>
            {/* 文本显示框 */}
            <Row>
              <Col>
                <div style={{ height: '30vh', background: '#e0e0e0' }}>
                  {/* 文本显示框组件 */}
                  Text Display
                </div>
              </Col>
            </Row>
          </Col>

          {/* 右侧区域 */}
          <Col md={6}>
            <div style={{ height: '60vh', background: '#d0d0d0' }}>
              <ImageDisplay />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
