const fs = require('fs');
const aedes = require('aedes')();
const path = require('path');

const options = {
  key: fs.readFileSync(path.join(__dirname, '../extra/localhost.key')),
  cert: fs.readFileSync(path.join(__dirname, '../extra/localhost.crt'))
};

const server = require('tls').createServer(options, aedes.handle);

server.listen(8883, () => {
  console.log('server started and listening on port 8883');
});

aedes.on('client', (client) => {
  console.log('new client', client.id);
  client.publish({
    topic: 'deviceId',
    payload: 'hello world'
  });
  client.close();
});
