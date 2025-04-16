//This is used so you can setup a listener in Prometheus to the server ip on port 8084 to extract the CPU temp. It's ran with node cpu-temp-prometheus-exporter/main.js

const http = require('http');
const { exec } = require('child_process');
const requestListener = function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain; version=0.0.4' });

    exec('sensors|grep "high"|grep "Core"|cut -d "+" -f2|cut -d "." -f1|sort -nr|sed -n 1p', (error, stdout, stderr) => {
        if (error) {
            console.error(`error: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }

        res.end(`server_cpu_temp ${stdout}`);
    });
}

const server = http.createServer(requestListener);
server.listen(8084);
