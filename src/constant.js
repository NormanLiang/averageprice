
const MSG_DEFINE = {
  START: 'start work',
  START_ONCE: 'start once',
  CHECK: 'check state',
  GET: 'get'
}

const WORKER_STATE = {
  STATE_IDLE: 'idle',
  STATE_RUNNING: 'receiving'
}

const BOOK_WORK_PATH = './src/localBook/bookWorker.js';
const DEPTH_WORK_PATH = './src/btcTrading/depthWorker.js';

const WS_URL = 'wss://stream.binance.com:9443/ws/bnbbtc@depth';

const DEPTH_SNAPSHOT_URL = 'https://api.binance.com/api/v3/depth?symbol=BNBBTC&limit=1000';

const MAX_BUFF_SIZE = 200;

const WORKDER_INDEX = {
  INDEX_LOCAL_BOOK: 'localBook',
  INDEX_DEPTH_SNAP: 'depthSnap',
}

module.exports = {
  MSG_DEFINE,
  WORKER_STATE,
  BOOK_WORK_PATH,
  DEPTH_WORK_PATH,
  DEPTH_SNAPSHOT_URL,
  WS_URL,
  MAX_BUFF_SIZE,
  WORKDER_INDEX
}