const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://127.0.0.1', {
  username: 'willin',
  password: 'test'
});

client.subscribe('deviceId');

client.on('message', (topic, message) => {
  // message is Buffer
  console.log(message.toString());
});
