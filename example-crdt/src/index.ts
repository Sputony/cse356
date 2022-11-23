// ... add imports and fill in the code
import * as Y from "yjs";
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'; 
import { fromUint8Array, toUint8Array } from 'js-base64';

class CRDTFormat {
  public bold?: Boolean = false;
  public italic?: Boolean = false;
  public underline?: Boolean = false;
};

exports.CRDT = class {
  // ...
  ydoc: any;
  ytext: any;
  cb: any;
  ydoc_update: any;

  constructor(cb: (update: string, isLocal: Boolean) => void) {
    // ...
    this.ydoc = new Y.Doc();
    this.ytext = this.ydoc.getText("quill");
    this.cb = cb;

    this.ydoc.on('update', (update: any) => {
      this.ydoc_update = fromUint8Array(update)
    });

    ['update', 'insert', 'delete', 'insertImage', 'toHTML'].forEach(f => (this as any)[f] = (this as any)[f].bind(this));
  }

  update(update: string) {
    // ...
    const binaryEncoded = toUint8Array(update);
    Y.applyUpdate(this.ydoc, binaryEncoded);
    const payload = { update: update };
    this.cb(`${JSON.stringify(payload)}`, false);
  }

  insert(index: number, content: string, format: CRDTFormat) {
    // ...
    this.ytext.insert(index, content, format);
    const payload = { update: this.ydoc_update};
    this.cb(`${JSON.stringify(payload)}`, true);
  }

  delete(index: number, length: number) {
    // ...
    this.ytext.delete(index, length);
    const payload = { update: this.ydoc_update};
    this.cb(`${JSON.stringify(payload)}`, true);
  }

  insertImage(index: number, url: string) {
    this.ytext.insert(index, { image: url });
    const payload = { update: this.ydoc_update};
    this.cb(`${JSON.stringify(payload)}`, true);
  }

  toHTML() {
    let html = '(fill me in)';
    // ...
    let cfg = {};
    let converter = new QuillDeltaToHtmlConverter(this.ytext.toDelta(), cfg);
    html = converter.convert();

    return html;
  }
};
