import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Button, Collapse } from "react-bootstrap";
import { useState } from "react";

const TextDisplay = () => {
  const progress = useSelector((state: RootState) => state.music.progress);
  const textInfo = useSelector((state: RootState) => state.music.text);
  const [open, setOpen] = useState(false);

  if (progress < 5) {
    return (
      <></>
    );
  }

  return (
    <>
      <Button onClick={() => setOpen(!open)} aria-controls="example-collapse-text" aria-expanded={open}>
        Show Text
      </Button>
      <Collapse in={open}>
        <div id="example-collapse-text" style={{ background: '#e0e0e0' }}>
          {textInfo}
        </div>
      </Collapse>
    </>
  );
};

export default TextDisplay;