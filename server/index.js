const fs = require('fs');
const aedes = require('aedes')();
const path = require('path');
const { eventhub: connStr } = require('./config');
const eventhub = require('./lib/eventhub');

const options = {
  key: fs.readFileSync(path.join(__dirname, '../extra/localhost.key')),
  cert: fs.readFileSync(path.join(__dirname, '../extra/localhost.crt'))
};

const server = require('tls').createServer(options, aedes.handle);

const clients = [];

aedes.authenticate = (client, username, password, callback) => {
  // 登录成功
  // 可以通过redis进行鉴权
  callback(null, username === 'willin');

  // 登录失败
  // const error = new Error('Auth error');
  // error.returnCode = 4;
  // callback(error, null);
};

aedes.authorizePublish = (client, packet, callback) => {
  callback(new Error('禁止发布消息'));
};

aedes.authorizeSubscribe = (client, sub, callback) => {
  // 订阅鉴权
  console.log(sub);
  if (sub.topic === 'test') {
    return callback(new Error('禁止越权订阅'));
    // sub = null;
  }
  callback(null, null);
};

eventhub({
  connStr,
  messageHandler: (message) => {
    clients.forEach((client) => {
      client.publish({
        topic: 'test',
        payload: JSON.stringify(message.body)
      });
    });
  }
}).then(() => {
  server.listen(8883, () => {
    console.log('server started and listening on port 8883');
  });
  aedes.on('client', (client) => {
    console.log('new client', client.id);
    clients.push(client);
    client.subscribe({
      subscriptions: [{
        topic: 'willin',
        qos: 0
      }]
    }, (err) => {
      if (err) {
        console.error(err);
      }
    });
    client.on('close', () => {
      const index = clients.findIndex(x => x.id === client.id);
      clients.splice(index, 1);
    });
  });
}).catch(err => console.error(err));

