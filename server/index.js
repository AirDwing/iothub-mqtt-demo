const fs = require('fs');
const path = require('path');
const mqttServer = require('mqtt-server');

const servers = mqttServer({
  mqtt: 'tcp://localhost:1883',
  mqtts: 'ssl://localhost:8883',
  mqttws: 'ws://localhost:1884',
  mqtwss: 'wss://localhost:8884'
}, {
  ssl: {
    key: fs.readFileSync(path.join(__dirname, '../extra/localhost.key')),
    cert: fs.readFileSync(path.join(__dirname, '../extra/localhost.crt'))
  },
  emitEvents: true // default
}, (client) => {
  client.connack({
    returnCode: 0
  });
});

servers.listen(() => {
  console.log('listening!');
});
