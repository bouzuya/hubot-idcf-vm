# Description
#   A Hubot script to control the virtual machine in IDCF cloud
#
# Configuration:
#   HUBOT_IDCF_VM_ENDPOINT
#   HUBOT_IDCF_VM_API_KEY
#   HUBOT_IDCF_VM_SECRET_KEY
#
# Commands:
#   hubot idcf vm list - list virtual machines
#   hubot idcf vm start <id> - start virtual machine
#   hubot idcf vm stop <id> - stop virtual machine
#
# Author:
#   bouzuya <m@bouzuya.net>
#
parseConfig = require 'hubot-config'
idcf = require '../idcf'

config = parseConfig 'idcf-vm',
  endpoint: null
  apiKey: null
  secretKey: null

module.exports = (robot) ->
  robot.respond /idcf vm list$/i, (res) ->
    client = idcf config
    client.request 'listVirtualMachines', {}
    .then (r) ->
      machines = r.body.listvirtualmachinesresponse.virtualmachine
      message = machines.map (i) ->
        "#{i.id} : #{i.displayname} : #{i.state}"
      .join '\n'
      res.send message
    .catch (e) ->
      robot.logger.error 'hubot-idcf-vm: error'
      robot.logger.error e
      res.send 'hubot-idcf-vm: error'

  robot.respond /idcf vm stop ([-0-9a-f]+)$/, (res) ->
    id = res.match[1]
    client = idcf config
    client.request 'stopVirtualMachine', { id }
    .then (r) ->
      robot.logger.info r.body
      res.send 'OK'
    .catch (e) ->
      robot.logger.error 'hubot-idcf-vm: error'
      robot.logger.error e
      res.send 'hubot-idcf-vm: error'

  robot.respond /idcf vm start ([-0-9a-f]+)$/, (res) ->
    id = res.match[1]
    client = idcf config
    client.request 'startVirtualMachine', { id }
    .then (r) ->
      robot.logger.info r.body
      res.send 'OK'
    .catch (e) ->
      robot.logger.error 'hubot-idcf-vm: error'
      robot.logger.error e
      res.send 'hubot-idcf-vm: error'
