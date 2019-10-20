'use strict'
const { HomebridgeMQTTBase } = require('homebridge-mqtt-base')
const { hsvToRgb, rgbToHsv } = require('./color-converters')

module.exports = (Service, Characteristic) =>
  class K5SLightController extends HomebridgeMQTTBase {
    state = {
      red: 0,
      green: 0,
      blue: 0
    }

    intermediateColor = {
      hue: 0,
      saturation: 0,
      brightness: 0
    }

    onRemoteStateChange(state) {
      const { red, green, blue } = state
      const [hue, saturation, brightness] = rgbToHsv(red, green, blue)
      const light = this.light

      this.log(`Received state update from accessory ${JSON.stringify({ hue, saturation, brightness })}`)

      light.updateCharacteristic(Characteristic.Hue, hue)
      light.updateCharacteristic(Characteristic.Saturation, saturation)
      light.updateCharacteristic(Characteristic.Brightness, brightness)
      light.updateCharacteristic(Characteristic.On, brightness > 0)

      Object.assign(this.intermediateColor, { hue, saturation, brightness })
      Object.assign(this.state, { red, green, blue })
    }

    setColor(color, callback) {
      const {
        hue = this.intermediateColor.hue,
        saturation = this.intermediateColor.saturation,
        brightness = this.intermediateColor.brightness
      } = color
      const [red, green, blue] = hsvToRgb(hue, saturation, brightness)
      Object.assign(this.intermediateColor, color)
      this.setStateAndEmit({ red, green, blue }, callback)
    }

    getServices() {
      const light = this.light = new Service.Lightbulb()

      light.getCharacteristic(Characteristic.Hue)
        .on('get', callback => callback(null, this.state.hue))
        .on('set', this.createOnSetHandler('hue'))

      light.getCharacteristic(Characteristic.Brightness)
        .on('get', callback => callback(null, this.state.brightness))
        .on('set', this.createOnSetHandler('brightness'))

      light.getCharacteristic(Characteristic.Saturation)
        .on('get', callback => callback(null, this.state.saturation))
        .on('set', this.createOnSetHandler('saturation'))

      // If On isn't last, it'll somehow interfere with remote updates to brightness
      light.getCharacteristic(Characteristic.On)
        .on('get', callback => callback(null, this.state.brightness > 0 ? true : false))
        .on('set', this.createOnSetHandler('brightness', on => on ? 100 : 0))

      return [light]
    }

    createOnSetHandler(name, valueConverter = value => value) {
      return (value, callback) => {
        const convertedValue = valueConverter(value)
        this.log(`${name} was set to ${convertedValue}`)
        this.setColor({ [name]: convertedValue }, callback)
      }
    }
  }
