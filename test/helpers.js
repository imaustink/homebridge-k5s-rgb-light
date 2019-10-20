const k5sLightPlugin = require('../src/homebridge-plugin')
const Characteristics = require('./mock-characteristics')
const MockMQTTClient = require('./mock-mqtt-client')
const Service = require('./mock-service')

function createPluginInstance() {
  const K5SLightPlugin = k5sLightPlugin(Service, Characteristics)
  const client = new MockMQTTClient()
  const log = jest.fn()
  const plugin = new K5SLightPlugin(log, { client })
  plugin.setStateAndEmit = jest.fn()
  // Homebridge calls this internally
  plugin.getServices()
  return plugin
}

module.exports = {
  createPluginInstance
}
