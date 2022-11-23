import { useCallback, useEffect, useState } from "react"
import * as Y from "yjs";
import Quill from "quill"
import "quill/dist/quill.snow.css"
import QuillCursors from 'quill-cursors';
import axios from "axios";
import { fromUint8Array, toUint8Array } from 'js-base64'
Quill.register('modules/cursors', QuillCursors);

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
  const[ cursors, setCursors ] = useState()

  useEffect(() => {
    if (!listening) {
      let url = 'http://cloudnine.cse356.compas.cs.stonybrook.edu/api/connect/' + props.docID;
      const event = new EventSource(url, { withCredentials: true });
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
    const handler = (range, oldRange, source) => {
      if (source === 'user' && range != null) {
        let url = 'http://cloudnine.cse356.compas.cs.stonybrook.edu/api/presence/' + props.docID;
        const headers = {
          'Content-Type': 'application/json'
        }
        axios.post(url, range, {headers: headers, withCredentials:true})
          .then(res => { console.log(res)})
          .catch(error => { console.log(error)})
      }
    }
    quill.on('selection-change', handler)

    return () => {
      quill.off('selection-change', handler)
    }
  }, [event, quill])

  useEffect(() => {
    if (event == null || quill == null) return
    event.addEventListener('update', (e) => {
      const binaryEncoded = toUint8Array(e.data)
      Y.applyUpdate(ydoc, binaryEncoded)
      quill.updateContents(binaryEncoded)
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

  useEffect(() => {
    if (event == null || quill == null) return
    event.addEventListener('presence', (e) => {
      const data = JSON.parse(e.data)
      console.log(data)
      cursors.removeCursor(data.session_id)

      if (JSON.stringify(data.cursor) !== '{}' ) {
        cursors.createCursor(data.session_id, data.name, 'blue')
        cursors.moveCursor(data.session_id, data.cursor)
      }
      cursors.update()
    })
  })

  const wrapperRef = useCallback(wrapper => {
    if (wrapper == null) return

    wrapper.innerHTML = ""
    const editor = document.createElement("div")
    wrapper.append(editor)
    const q = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: TOOLBAR_OPTIONS,
        cursors: { transformOnTextChange: true }
      },
    })
    q.disable()
    q.setText("Loading...")
    setQuill(q)
    setCursors(q.getModule('cursors'))
  }, [])
  return <div className="container" ref={wrapperRef}></div>
};

export default TextEditor;
