const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if(isMainThread) {
    const worker = new Worker('./worker_threads.js', { workerData: 'Hello from main thread!' });
    worker.on('message', (message) => {
        console.log('Message from worker:', message);
    });
    worker.postMessage('Hello from main thread!');
} else {
    console.log('Worker Data', workerData);
    parentPort.postMessage('Hello from worker thread!');
    parentPort.on('message', (message) => {
        console.log('Message from main thread:', message);
    });
}