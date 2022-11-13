import { useState } from 'react';
import TextEditor from './TextEditor';

function TextForm() {
  const [docID, setDocID] = useState("");
  const [textBox, setTextBox] = useState();

  let handleSubmit = async (e) => {
    e.preventDefault();
    setTextBox(<TextEditor docID={docID}/>);
  }
  return (
    <div className="TextForm">
      <form onSubmit={handleSubmit}>
        Document ID: <input type="text" value={docID} onChange={(e) => setDocID(e.target.value)}/>
        <button type="submit">Open</button>
      </form>
      <br></br>
      {textBox}
    </div>
  );
}

export default TextForm;
