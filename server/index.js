const fs = require('fs');
const path = require('path');
const mqttServer = require('./lib/mqtt-server');

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
  client.on('connect', function (data) {
    const username = data.username;
    const password = data.password.toString();
    console.log(username, password);
    // 发布测试
    client.publish({
      topic: 'deviceId',
      payload: 'hello world'
    });
    if (username !== 'willin' || password !== 'willin') {
      // 中断连接
      this.disconnect();
    }
  });
  // client.on('data', (data) => {
  //   if (data.cmd === 'connect') {
  //     console.log(data.username, data.password.toString());
  //   }
  //   console.log(data);
  // });
});

servers.listen(() => {
  console.log('listening!');
});
