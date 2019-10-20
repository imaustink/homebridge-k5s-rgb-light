'use strict';

const getK5SFanController = require('./homebridge-plugin');

module.exports = function (homebridge) {
  const K5SRGBLight = getK5SFanController(homebridge.hap.Service, homebridge.hap.Characteristic);
  homebridge.registerAccessory('K5S-light-controller', 'K5SRGBLight', K5SRGBLight);
};
