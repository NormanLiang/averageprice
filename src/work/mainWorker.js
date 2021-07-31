const { Worker, isMainThread } = require('worker_threads');
const { BOOK_WORK_PATH, MSG_DEFINE, DEPTH_WORK_PATH, WORKDER_INDEX, WORKER_STATE } = require('../constant');

class WorkerManager {
  constructor() {
    this.bookWorker = null;
    this.depthWorker = null;
    this.bookWorkerState = WORKER_STATE.STATE_IDLE;
    this.depthWorkerState = WORKER_STATE.STATE_IDLE;

    this.depthSnap = null;
    this.bookData = null;
  }

  initial() {
    if (isMainThread) {
      this.bookWorker = new Worker(BOOK_WORK_PATH);
      this.depthWorker = new Worker(DEPTH_WORK_PATH);

      this.bookWorker.on('message', (msg) => {
        const {state, data} = msg;
        if (state) {
          this.bookWorkerState = state;
        }

        if (data) {
          this.bookData = data;
        }
      });

      this.depthWorker.on('message', (msg) => {
        this.depthSnap = msg;
      })

      return true;
    } else {
      return false;
    }
  }

  startToWork(worker) {
    worker.postMessage({cmd: MSG_DEFINE.START});
  }

  getWorker(workerIdx) {
    if (workerIdx === WORKDER_INDEX.INDEX_LOCAL_BOOK) {
      return this.bookWorker;
    } else {
      return this.depthWorker;
    }
  }

  send(worker, msg) {
    worker.postMessage({cmd: msg});
  }

  checkWorkerState(worker) {
    worker.postMessage({cmd: MSG_DEFINE.CHECK});
  }

  getState(worker) {
    if (worker === this.bookWorker) {
      return this.bookWorkerState;
    } else {
      return this.depthWorkerState;
    }
  }

  getSnapShot() {
    return this.depthSnap;
  }

  checkLocalBookItem(lastUpdateId) {
    this.bookWorker.postMessage({cmd: MSG_DEFINE.GET, value: lastUpdateId});
  }

  getBookData() {
    return this.bookData;
  }
}


module.exports = {
  WorkerManager
}

