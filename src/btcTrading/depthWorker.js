const { parentPort } = require('worker_threads');
const { takeSnap } = require('./depthSnap');
const { MSG_DEFINE } = require('../constant');


parentPort.on('message', (msg) => {
    const { cmd } = msg;
    switch (cmd) {
  
      case MSG_DEFINE.START_ONCE:
      case MSG_DEFINE.START:
        takeSnap().then((data) => {
          parentPort.postMessage(data);
        });

        break;
  
      default:
        break;
    }
    
});