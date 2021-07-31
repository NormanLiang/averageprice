const { parentPort } = require('worker_threads');
const { MSG_DEFINE, WS_URL, MAX_BUFF_SIZE, WORKER_STATE } = require('../constant');
const { LocalBook } = require('./localBook');

let localBook = null;

parentPort.on('message', (msg) => {
  const { cmd, value } = msg;

  switch (cmd) {

    case MSG_DEFINE.START:
      localBook = new LocalBook(WS_URL, MAX_BUFF_SIZE);
      localBook.connect();
      break;

    case MSG_DEFINE.CHECK:
      parentPort.postMessage({state: localBook.getState()});
      break;

    case MSG_DEFINE.GET:
      const res = localBook.get(value);
      parentPort.postMessage({data: res});
      break;

    default:
      break;
  }
  
});