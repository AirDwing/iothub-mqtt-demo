const mqtt = require('mqtt');

const client = mqtt.connect('mqtts://127.0.0.1', {
  rejectUnauthorized: false,
  username: 'willin',
  password: 'test'
});

// 订阅需要加 callback 回调来处理异常
client.subscribe('test', (err, result) => {
  if (err) {
    console.error(err);
  }
  result.forEach((x) => {
    // >=128  表示鉴权失败, 断开
    if (x.qos >= 128) {
      client.close();
    }
  });
});

client.on('message', (topic, message) => {
  // message is Buffer
  console.log(message.toString());
});

// 禁止发布消息
// client.publish('deviceId', 'test', (err) => {
//   if (err) {
//     console.error(err);
//   }
// });

// 必要
client.on('close', () => {
  client.end();
});
