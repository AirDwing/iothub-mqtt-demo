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

aedes.on('client', (client) => {
  console.log('new client', client.id);
  client.subscribe({
    subscriptions: [{
      topic: 'deviceId',
      qos: 0
    }]
  }, (err) => {
    if (err) {
      console.error(err);
    }
  });

  setTimeout(() => {
    client.publish({
      topic: 'test',
      payload: 'hello world'
    });
  }, 3000);
});

