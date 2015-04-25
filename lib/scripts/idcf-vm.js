// Description
//   A Hubot script to control the virtual machine in IDCF cloud
//
// Configuration:
//   HUBOT_IDCF_VM_ENDPOINT
//   HUBOT_IDCF_VM_API_KEY
//   HUBOT_IDCF_VM_SECRET_KEY
//
// Commands:
//   hubot idcf vm list - list virtual machines
//   hubot idcf vm start <id> - start virtual machine
//   hubot idcf vm stop <id> - stop virtual machine
//
// Author:
//   bouzuya <m@bouzuya.net>
//
var config, idcf, parseConfig;

parseConfig = require('hubot-config');

idcf = require('idcf-cloud-api');

config = parseConfig('idcf-vm', {
  endpoint: null,
  apiKey: null,
  secretKey: null
});

module.exports = function(robot) {
  robot.respond(/idcf vm list$/i, function(res) {
    var client;
    client = idcf(config);
    return client.request('listVirtualMachines', {}).then(function(r) {
      var machines, message;
      machines = r.body.listvirtualmachinesresponse.virtualmachine;
      message = machines.map(function(i) {
        return i.id + " : " + i.displayname + " : " + i.state;
      }).join('\n');
      return res.send(message);
    })["catch"](function(e) {
      robot.logger.error('hubot-idcf-vm: error');
      robot.logger.error(e);
      return res.send('hubot-idcf-vm: error');
    });
  });
  robot.respond(/idcf vm stop ([-0-9a-f]+)$/, function(res) {
    var client, id;
    id = res.match[1];
    client = idcf(config);
    return client.request('stopVirtualMachine', {
      id: id
    }).then(function(r) {
      robot.logger.info(r.body);
      return res.send('OK');
    })["catch"](function(e) {
      robot.logger.error('hubot-idcf-vm: error');
      robot.logger.error(e);
      return res.send('hubot-idcf-vm: error');
    });
  });
  return robot.respond(/idcf vm start ([-0-9a-f]+)$/, function(res) {
    var client, id;
    id = res.match[1];
    client = idcf(config);
    return client.request('startVirtualMachine', {
      id: id
    }).then(function(r) {
      robot.logger.info(r.body);
      return res.send('OK');
    })["catch"](function(e) {
      robot.logger.error('hubot-idcf-vm: error');
      robot.logger.error(e);
      return res.send('hubot-idcf-vm: error');
    });
  });
};
