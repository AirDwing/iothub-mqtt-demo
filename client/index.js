const mqtt = require('mqtt');

const client = mqtt.connect('mqtts://127.0.0.1', {
  rejectUnauthorized: false,
  username: 'willin',
  password: 'test'
});

client.subscribe('test', (err, result) => {
  if (err) {
    console.error(err);
  }
  console.log(result);
});

client.on('message', (topic, message) => {
  // message is Buffer
  console.log(message.toString());
});

client.publish('deviceId', 'test', (err) => {
  if (err) {
    console.error(err);
  }
});

// 必要
// client.on('close', () => {
//   client.end();
// });
