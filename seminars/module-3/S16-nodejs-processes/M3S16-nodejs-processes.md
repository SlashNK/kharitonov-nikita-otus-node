# Seminar M3L16: Управление процессами Node.js   (26.06.24)

## Процесс и поток

### Процесс

Это экземпляр программы во время выполнения, независимый объект, с выделенными системными ресурсами. Каждый процесс выполняется в отдельном адресном пространстве, для общение с другими процессами используется межпроцессорное взаимодействие (конвейеры, файлы и т.д.).

[node:child_process](https://nodejs.org/api/child_process.html)

### Поток

Это способ выполнения процесса. Внутри процесса может работать множество потоков одновременно. Ключевая особенность в том, что они работают совместно с тем же самым пространством стека, что и процесс. используют данные своих состояний. Как правило, потоки 1 процесса могут работать с одной и той же областью памяти. У каждого потока есть собственные регистры и собственный стек, но другие потоки могут их использовать.

[node:worker_threads](https://nodejs.org/api/worker_threads.html)


## [node:child_process](https://nodejs.org/api/child_process.html)



- `exec` буферизует output, ждет завершения процесса и возвращает результата
```javascript
const { exec } = require("child_process");
exec('ls -lh', (error, stdout, stderr) => {
    if(error) {
        console.error(`Error: ${error.message}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
})
```
- `spawn` же использует streams
```javascript
const {spawn} = require('child_process');
const child = spawn('ls', ['-lh', './']);
child.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});
child.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
});
child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});
```
- `fork` самый тяжеловесный, для выполнения node модулей рекомендуется использовать его
```javascript
const {fork} = require('child_process');

const child = fork('./spawn.js');
child.on('message', (message) => {
    console.log('Parent received:', message);
});
child.send('Hello from parent');
```

Библиотека [execa](https://www.npmjs.com/package/execa) позволяет более удобно работать с процессами ноды 


## [node:worker_threads](https://nodejs.org/api/worker_threads.html)

Позволяет работать с потоками 

```javascript
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
```

Для менеджмента и работы своркерами есть библиотеки: [piscina](https://www.npmjs.com/package/piscina) [workerpool](https://www.npmjs.com/package/workerpool)


Для стресстестирования можно использовать библиотеку [AutoCannon](https://www.npmjs.com/package/autocannon)

## [node:cluster](https://nodejs.org/api/cluster.html)

Позволяет запускать множество инстансов Node.js (на разных CPU), которые могут распределять нагрузку между своими рабочими потоками (с изоляцией процессов). 