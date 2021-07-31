
const { DEPTH_SNAPSHOT_URL } = require('../constant');
const request = require('request');

const options = {
  url: DEPTH_SNAPSHOT_URL,
  Headers: {
    'User-Agent': 'request'
  }
}

function takeSnap() {
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (!error && response.statusCode == 200) { 
        let info = JSON.parse(body);
        resolve(info);
      } else {
        reject(error);
      }
    });
  });
}

module.exports = {
  takeSnap,

}


