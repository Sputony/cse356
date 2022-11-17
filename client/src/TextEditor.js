import { useCallback, useEffect, useState } from "react"
import * as Y from "yjs";
import Quill from "quill"
import "quill/dist/quill.snow.css"
import axios from "axios";
import { fromUint8Array, toUint8Array } from 'js-base64'

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
]

function TextEditor(props) {

  const[ listening, setListening ] = useState(false);
  const[ event, setEvent ] = useState()
  const[ quill, setQuill ] = useState()
  const[ ydoc, setYdoc ] = useState()
  const[ ytext, setYtext ] = useState()

  useEffect(() => {
    if (!listening) {
      let url = 'http://cloudnine.cse356.compas.cs.stonybrook.edu/api/connect/' + props.docID;
      const event = new EventSource(url);
      const ydoc = new Y.Doc();
      const ytext = ydoc.getText("quill");

      ydoc.on('update', update => {
        const base64Encoded = fromUint8Array(update)
        let url = 'http://cloudnine.cse356.compas.cs.stonybrook.edu/api/op/' + props.docID;
        const headers = {
          'Content-Type': 'application/json'
        }
        axios.post(url, {update: base64Encoded}, {headers: headers, withCredentials:true})
          .then(res => { console.log(res)})
          .catch(error => { console.log(error)})
      })

      setEvent(event);
      setYdoc(ydoc);
      setYtext(ytext);
      setListening(true);
    }
    return () => {
      event.close();
    }
  }, [])

  useEffect(() => {
    if (event == null || quill == null) return

    const handler = (delta, oldDelta, source) => {
      if (source !== 'user') return;
      ytext.applyDelta(delta.ops);
    };
    quill.on('text-change', handler)
    
    return () => {
      quill.off('text-change', handler)
    }
  }, [event, quill])

  useEffect(() => {
    if (event == null || quill == null) return
    event.addEventListener('update', (e) => {
      const binaryEncoded = toUint8Array(e.data)
      Y.applyUpdate(ydoc, binaryEncoded)
      quill.setContents(ytext.toDelta())
    })
  })

  useEffect(() => {
    if (event == null || quill == null) return;
    event.addEventListener('sync', (e) => {
      const binaryEncoded = toUint8Array(e.data)
      Y.applyUpdate(ydoc, binaryEncoded)
      quill.setContents(ytext.toDelta())
      quill.enable()  
    });
  })

  const wrapperRef = useCallback(wrapper => {
    if (wrapper == null) return

    wrapper.innerHTML = ""
    const editor = document.createElement("div")
    wrapper.append(editor)
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    })
    q.disable()
    q.setText("Loading...")
    setQuill(q)
  }, [])
  return <div className="container" ref={wrapperRef}></div>
};

export default TextEditor;
