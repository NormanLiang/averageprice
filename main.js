const { WorkerManager } = require('./src/work/mainWorker.js');
const { WORKDER_INDEX, WORKER_STATE } = require('./src/constant');
const inquirer = require('inquirer');
const MAIN_STATE = {
  STATE_IDLE: 'idle',
  STATE_WAITING: 'waiting',
  STATE_ASKING: 'asking',
  STATE_SNAPING: 'snapshoting',
  STATE_CALCULATING: 'calculating',
  STATE_CHECKING_BOOK: 'checking',
}

const DEBUG = false;

const question = {
  type: 'input',
  name: 'quantity',
  message: 'Please give me a quantity: ',
  default: 10,
}

function wait(timer) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timer);
  });
}

function process(quantity, bookData) {

  console.log('processing data here: ', quantity, bookData);

  const bidPrice = bookData.b.reduce((accu, ele) => {
    price = parseFloat(ele[0]);
    quantity = parseFloat(ele[1]);

    if (quantity > 0) {
      accu['price'] += price*quantity;
      accu['quantity'] += quantity;
    }
    return accu;
  }, {price: 0, quantity: 0});


  const askPrice = bookData.a.reduce((accu, ele) => {
    price = parseFloat(ele[0]);
    quantity = parseFloat(ele[1]);

    if (quantity > 0) {
      accu['price'] += price*quantity;
      accu['quantity'] += quantity;
    }
    return accu;
  }, {price: 0, quantity: 0});


  return {averageBidPrice: bidPrice.price/bidPrice.quantity,
  averageAskPrice: askPrice.price/askPrice.quantity};
}

async function main() {
  const workerManager = new WorkerManager();
  const res = workerManager.initial();
  let state = MAIN_STATE.STATE_IDLE;
  let quantity = 0;
  let snapshot = null;
  let bookdata = null;

  state = MAIN_STATE.STATE_WAITING;
  if (res) {

    console.log('Local book is starting...');
  
    const localBook = workerManager.getWorker(WORKDER_INDEX.INDEX_LOCAL_BOOK);
    const depthSnap = workerManager.getWorker(WORKDER_INDEX.INDEX_DEPTH_SNAP);

    workerManager.startToWork(localBook);

    while (true) {
      await wait(1000).then(() => {

        switch (state) {
          case MAIN_STATE.STATE_WAITING:
            if (workerManager.getState(localBook) === WORKER_STATE.STATE_RUNNING) {
              console.log('Local book is ready');
  
              state = MAIN_STATE.STATE_ASKING;

              if (DEBUG) {
                quantity = 5;
                state = MAIN_STATE.STATE_SNAPING;
                workerManager.startToWork(depthSnap);
              } else {
                inquirer.prompt(question).then((q) => {
                  quantity = q;
                  state = MAIN_STATE.STATE_SNAPING;
                  workerManager.startToWork(depthSnap);
                });
              }
            } else {
              workerManager.checkWorkerState(localBook);
            }
            break;

          case MAIN_STATE.STATE_SNAPING:
            {
              snapshot = workerManager.getSnapShot();
              if (snapshot) {
                state = MAIN_STATE.STATE_CHECKING_BOOK;
                const lastUpdateId = snapshot.lastUpdateId;
                workerManager.checkLocalBookItem(lastUpdateId);
              }
            }
            break;

          case MAIN_STATE.STATE_CHECKING_BOOK:
            {
              bookdata = workerManager.getBookData();
              if (bookdata) {
                const res = process(quantity, bookdata);

                if (res.averageAskPrice || res.averageBidPrice) {
                  console.clear();
                  console.log('average bid price: ', res.averageBidPrice);
                  console.log('average ask price: ', res.averageAskPrice);
                  
                }

                state = MAIN_STATE.STATE_WAITING;
              }
            }

            break;

          default:
            break;
        }
      });
    }
  

  } else {
  
  }
}

main();


