import './App.css';
import 'react-h5-audio-player/lib/styles.css';
import StageBar from "./StageBar/StageBar.tsx";
import { Container, Row, Col} from 'react-bootstrap';
import MusicPlayer from "./MusicPlayer/MusicPlayer.tsx";
import ImageDisplay from "./ImageDisplay/ImageDisplay.tsx";
import TextDisplay from "./TextDisplay/TextDisplay.tsx";

function App() {

  return (
    <>
      <h1>Music2Pic</h1>
      <Container fluid>
        {/* 进度条 */}
        <Row style={{ marginBottom: '20px' }}>
          <Col>
            <StageBar />
          </Col>
        </Row>
        {/* 音乐播放器 */}
        <Row style={{ marginBottom: '20px' }}>
          <Col>
            <MusicPlayer />
          </Col>
        </Row>
        {/* 文本显示框 */}
        <Row style={{ marginBottom: '20px' }}>
          <Col>
            <TextDisplay />
          </Col>
        </Row>
        {/* 图片显示 */}
        <Row>
          <Col>
            <ImageDisplay />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;