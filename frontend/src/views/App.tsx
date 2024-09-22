import './App.css';
import 'react-h5-audio-player/lib/styles.css';
import StageBar from "./StageBar/StageBar.tsx";
import { Container, Row, Col } from 'react-bootstrap';
import MusicPlayer from "./MusicPlayer/MusicPlayer.tsx";
import ImageDisplay from "./ImageDisplay/ImageDisplay.tsx";
import TextDisplay from "./TextDisplay/TextDisplay.tsx";

function App() {
  return (
    <>
      <h1>音の絵</h1>
      <Container fluid>
        {/* 图片显示 */}
        <Row className="mb-3">
          <Col>
            <ImageDisplay />
            <TextDisplay />
          </Col>
        </Row>
        {/* 进度条 */}
        <Row className="mb-3">
          <Col>
            <StageBar />
          </Col>
        </Row>
        {/* 音乐播放器 */}
        <Row className="mb-3">
          <Col>
            <MusicPlayer />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;