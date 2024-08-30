const { exec } = require("child_process");

exec('ls -lh', (error, stdout, stderr) => {
    if(error) {
        console.error(`Error: ${error.message}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
})