const {fork} = require('child_process');

const child = fork('./spawn.js');
child.on('message', (message) => {
    console.log('Parent received:', message);
});
child.send('Hello from parent');