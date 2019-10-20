'use strict';

const getK5SRGBLight = require('./homebridge-plugin');

module.exports = function (homebridge) {
  const K5SRGBLight = getK5SRGBLight(homebridge.hap.Service, homebridge.hap.Characteristic);
  homebridge.registerAccessory('K5S-RGB-light', 'K5SRGBLight', K5SRGBLight);
};
