# Average Price


- [Average Price](#average-price)
  - [About](#about)
  - [Install and Run](#install-and-run)
  - [Dependencies](#dependencies)
  - [Structure](#structure)
  - [Test](#test)
  - [Calculation](#calculation)



## About

The solution uses worker_threads to do multi-thread job for JS. There are two workers in the application. One is getting price item using websocket. The other one is getting lastupdate information. When all the data are ready. Mainthread is going to calculate the result. 

## Install and Run 

- Clone Repository
- Run "npm install"
- Run "npm start"

## Dependencies

- WebSocket
  Connect to get the price every seond. 
  Max buffer is 200. It is a constant number set in project. The price can be stored in the database. 
  
  If item is more than 200. The first one will be deleted and the new one would push at the end.

- Worker_threads
  Make a thread to connect to websocket and get price item every seconds.
  The other thread is to make a snapshot to get the lastUpdateId 

## Structure

- work
  worker layer is control all the workers(threads). 

- local book
  bookworker is the worker interface. It response the command from mainThread. 
  localBook do the real job. It connect websocket and get price every seconds.

- btc tranding
  The name is not correct because it won't do any trading :D
  depthWorker is worker interface. Similar with the local book.
  depthSnap is doing the http get. request lib is used here.

## Test
  I didn't do any test on this project. 

## Calculation
  I actually cannot understand why input quantity is needed. I use the lastUpdateId to search the local book record and find the correct item. Using the item just do a simple calculation: 
  average price = ((price_1 * quantity_1) + ... + (price_n * quantity_n)) / (quantity_1 + ... + quantity_n) 

  Too much terms to google. I did my best...
  