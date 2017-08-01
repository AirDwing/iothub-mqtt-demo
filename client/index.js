const mqtt = require('mqtt');

const client = mqtt.connect('mqtts://127.0.0.1', {
  // rejectUnauthorized: false,
  username: 'willin',
  password: 'test'
});

client.subscribe('deviceId');

client.on('message', (topic, message) => {
  // message is Buffer
  console.log(message.toString());
});

client.on('close', () => {
  client.end();
});

