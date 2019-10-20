class Lightbulb {
  updateCharacteristic = jest.fn()
  getCharacteristic = jest.fn(() => this)
  on = jest.fn(() => this)
}

module.exports = {
  Lightbulb
}
