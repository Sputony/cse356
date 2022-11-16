var express = require('express');
var router = express.Router();

const Y = require('yjs');
const {Base64} = require('js-base64');
const isAuth = require("../isAuth")

function opHandler(request, response, next) {
    let docID = request.params.id;
    let ydoc = ydocMap.get(docID);
    const binaryEncoded = Base64.toUint8Array(request.body.update)
    Y.applyUpdate(ydoc, binaryEncoded);
    
    let clientList = clients.get(docID)
    let data = `event: update\ndata: ${JSON.stringify(request.body.update)}\n\n`;
    for (let i = 0; i < clientList.length; i++) {
        let stream = clientList[i].stream
        stream.write(data)
    }
    response.status(200).end()
}

function connectHandler(request, response) {
    console.log("Connecting to client");

    let docID = request.params.id;
    response.set({
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    });
    response.flushHeaders();

    let ydoc;
    if (ydocMap.has(docID)) {
        ydoc = ydocMap.get(docID)
    }
    else {
        ydoc = new Y.Doc()
        ydocMap.set(docID, ydoc);
    }
    
    const documentState = Y.encodeStateAsUpdate(ydoc)
    const base64Encoded = Base64.fromUint8Array(documentState)
    const data = `event: sync\ndata: ${JSON.stringify(base64Encoded)}\n\n`;
    response.write(data);
    
    const clientID = Date.now();
    let clientObj = {
        id: clientID,
        stream: response
    };

    if (clients.has(docID)) {
        clients.get(docID).push(clientObj);
    }
    else {
        clients.set(docID, [clientObj]);
    }
    request.on('close', () => {
        console.log(`${clientID} Connection closed`);
        clients.delete(clientID)
    });
}

router.get('/connect/:id', isAuth, connectHandler);
router.post('/op/:id', isAuth, opHandler);

let clients = new Map();
let ydocMap = new Map();

module.exports = router;