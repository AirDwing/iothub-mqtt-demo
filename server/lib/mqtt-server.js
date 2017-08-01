const css = require('create-stream-server');
const mqtt = require('mqtt-connection');

module.exports = function (config = {}, options = {}, clientHandler = () => { }) {
  // eslint-disable-next-line no-param-reassign
  if (options.emitEvents === undefined) options.emitEvents = true;

  return css(config, options, clientStream =>
    clientHandler(mqtt(clientStream, {
      notData: !options.emitEvents
    }))
  );
};
