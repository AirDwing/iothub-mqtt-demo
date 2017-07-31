const { Registry, SharedAccessSignature: { create: sas } } = require('azure-iothub');
const { getDefer } = require('@dwing/common');
const { eventhub: connectionString } = require('../config');

let hostname = connectionString.match(/HostName=([^;]*)/);
if (hostname === null) {
  hostname = '';
} else {
  hostname = hostname[1];
}

const registry = Registry.fromConnectionString(connectionString);

/**
 * 获取 MQTT 服务器连接信息
 * @param {string} did 设备id
 * @return {object} 域名和连接信息
 */
exports.mqttInfo = (did) => {
  const deferred = getDefer();
  registry.get(did, (err, deviceInfo) => {
    if (err) {
      deferred.reject(err);
      return;
    }
    const key = deviceInfo.authentication.symmetricKey.primaryKey;
    const password = sas(`${hostname}%2Fdevices%2F0670124905`, '', key, new Date().getTime() + 86400).toString();
    deferred.resolve(
      {
        domain: `ssl://${hostname}:8883`,
        info: {
          username: `${hostname}/${did}/api-version=2016-11-14`,
          password
        }
      }
    );
  });
  return deferred.promise;
};
