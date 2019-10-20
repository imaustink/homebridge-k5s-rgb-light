# K5S RGB LED Plugin for Homebridge
This plugin will create a new light accessory with On, Hue, Saturation, and Brightness characteristics. Updates from HomeKit are processed by the plugin and converted to RGB before being sent out over MQTT on a topic of your choosing. This allows you to easily build your own RGB light controller that can interact with HomeKit and Siri.

This plugin leverages the [homebridge-mqtt-base](https://github.com/imaustink/homebridge-mqtt-base) library to implement the MQTT communication.

## Prerequisite
1. Something to run Homebridge and an MQTT Broker on ([Raspberry Pis](https://www.adafruit.com/?q=raspberry%20pi) are great for this)
2. An network connected device that can act as an MQTT client (I use [Photons](https://store.particle.io/collections/wifi/products/photon))
3. [Homebridge](https://github.com/nfarina/homebridge)
4. An MQTT broker (I use [Mosquitto](https://mosquitto.org/))

## Example Homebridge config
```json
{
  "bridge": {
    "name": "Homebridge",
    "username": "CC:22:3D:E3:CE:30",
    "port": 51826,
    "pin": "031-45-154"
  },
  "description": "Example configuration",
  "ports": {
    "start": 52100,
    "end": 52150
  },
  "accessories": [{
    "accessory": "K5SRGBLight",
    "name": "LED Strip",
    "host": "10.0.1.24",
    "inboundTopic": "/example-light/inbound",
    "outboundTopic": "/example-light/outbound"
  }],
  "platforms": []
}
```
## Parameters
- __host__ (`String`) the hostname of the MQTT broker
- __inboundTopic__ (`String`) the topic used to emit from the accessory to HomeKit
- __outboundTopic__ (`String`) the topic used to emit from HomeKit to the accessory

## MQTT Interface
The plugin will send a JSON payload with `red`, `green`, and `blue` fields to the topic specified in `outboundTopic`.

To update the plugin's (and HomeKit's) state from the outside, send a JSON payload of the same structure to the topic specified in `inboundTopic`.

```json
{ "red": 0, "green": 0, "blue": 255 }
```
All colors can be a `float` between `0` and `255`.
