const EventHubClient = require('azure-event-hubs').Client;
const { Message } = require('@airx/proto');

const getPartitionIds = async (connStr) => {
  const client = EventHubClient.fromConnectionString(connStr);
  await client.open();
  const partitionIds = await client.getPartitionIds();
  return partitionIds;
};

const defaultErrorHandler = async (err) => {
  console.error(err);
};

const defaultMessageHandler = (message) => {
  try {
    const decodedMessage = Message.decode(message.body);
    return decodedMessage;
  } catch (e) {
    console.error(e);
    return {};
  }
};

const createReceiver = async ({ connStr = '', errorHandler = defaultErrorHandler, messageHandler = defaultMessageHandler } = {}) => {
  const client = EventHubClient.fromConnectionString(connStr);
  await client.open();
  const partitionIds = await getPartitionIds(connStr);
  partitionIds.forEach(async (partitionId) => {
    const receiver = await client.createReceiver('$Default', partitionId, { startAfterTime: Date.now() });
    receiver.on('errorReceived', async (err) => {
      if (err.transport && err.transport.name === 'AmqpProtocolError') {
        console.log(`Restart #${partitionId}`);
        await createReceiver({ connStr, errorHandler, messageHandler });
      } else {
        await errorHandler(err);
      }
    });
    receiver.on('message', messageHandler);
  });
};

exports.createReceiver = createReceiver;
