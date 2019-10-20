'use strict'
const { rgbToHsv, hsvToRgb } = require('../src/color-converters')
const { createPluginInstance } = require('./helpers')
const Characteristics = require('./mock-characteristics')

jest.useFakeTimers()

describe('K5S RGB Light Plugin', () => {
  let plugin
  beforeEach(() => {
    plugin = createPluginInstance()
  })
  describe('.onRemoteStateChange()', () => {
    test('synchronizes state between the accessory, Homebridge, and HomeKit', () => {
      const red = 200
      const green = 150
      const blue = 200
      const state = { red, green, blue }
      const [hue, saturation, brightness] = rgbToHsv(red, green, blue)
      const { updateCharacteristic } = plugin.light

      plugin.onRemoteStateChange(state)

      expect(updateCharacteristic).toHaveBeenCalledWith(Characteristics.Hue, hue)
      expect(updateCharacteristic).toHaveBeenCalledWith(Characteristics.Saturation, saturation)
      expect(updateCharacteristic).toHaveBeenCalledWith(Characteristics.Brightness, brightness)
      expect(updateCharacteristic).toHaveBeenCalledWith(Characteristics.On, true)
      expect(plugin.state).toEqual(state)
      expect(plugin.intermediateColor).toEqual({ hue, saturation, brightness })
    })
  })

  describe('.setColor()', () => {
    it('updates state and emits MQTT event', () => {
      const hue = 360
      const saturation = 50
      const brightness = 100
      const color = { hue, saturation, brightness }
      const [red, green, blue] = hsvToRgb(hue, saturation, brightness)
      const callback = () => { }

      plugin.setColor(color, callback)

      expect(plugin.intermediateColor).toEqual(color)
      expect(plugin.setStateAndEmit).toHaveBeenCalledWith({ red, green, blue }, callback)
    })
  })

  describe('.getServices', () => {
    test('initializes Lightbulb service and creates listeners', () => {
      // .getServices() is called internally by Homebridge and createPluginInstance,
      // no need to call it again for this test
      const { getCharacteristic } = plugin.light

      expect(getCharacteristic).toHaveBeenCalledWith(Characteristics.Hue)
      expect(getCharacteristic).toHaveBeenCalledWith(Characteristics.Brightness)
      expect(getCharacteristic).toHaveBeenCalledWith(Characteristics.Saturation)
      // This needs to be called last or there is problems
      expect(getCharacteristic).toHaveBeenLastCalledWith(Characteristics.On)
    })
  })

  describe('.createOnSetHandler', () => {
    test('creates an onSet handler', () => {
      jest.spyOn(plugin, 'setColor')
      const handler = plugin.createOnSetHandler('foo', value => value + 1)
      const callback = () => { }

      handler(1, callback)

      expect(plugin.setColor).toHaveBeenCalledWith({ foo: 2 }, callback)
    })
  })
})
