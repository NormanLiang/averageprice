
const WebSocket = require('ws');
const { WORKER_STATE } = require('../constant');


class LocalBook{

  constructor(url, maxBuffSize) {
    this.ws = new WebSocket(url);
    this._max = maxBuffSize;
    this.state = WORKER_STATE.STATE_IDLE;
    this.dataQueue = [];
  }

  connect() {
    this.ws.on('open', () => {
      console.log('clinet open');
    });

    this.ws.on('message', (msg) => {
      const data = msg.toString();
      // console.log('data is receiving: ', data);
      this._check();
      this.dataQueue.push(data);
      this.state = WORKER_STATE.STATE_RUNNING;
    });
    return this.state;
  }

  _check() {
    if (this.dataQueue >= this._max) {
      this.dataQueue.splice(0, 1);
    }
  }

  getState() {
    return this.state;
  }

  filter(idx) {
    return JSON.parse(this.dataQueue[idx]);
  }

  get(updateId) {
    const idx = this.dataQueue.findIndex((ele) => {
      const event = JSON.parse(ele);
      if (event.U <= updateId && event.u >= updateId) {
        return true;
      } else {
        return false;
      }
    });

    let res = null;

    if (idx !== -1) {
      res = this.filter(idx);
    }

    return res;
  }
}


module.exports = {
  LocalBook,
}
