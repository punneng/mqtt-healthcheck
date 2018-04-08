import Healthcheck from './healthcheck'
class Parser {
  constructor(message) {
    this.message = message
    this._validate()
  }

  async getResponseText () {
    if (this.message === 'healthcheck') {
      const healthcheck = new Healthcheck()
      const response = await healthcheck.fetch()
      const messages = await Promise.all(response.map(device => {
        const { name, status } = device
        return `${name} is ${status}`
      }))
      return messages.join('\n')
    } else {
      return `There is something wrong with message: ${this.message}`
    }
  }

  _validate () {
    if (this.message === 'healthcheck') {
      this.valid = true
    } else {
      this.valid = false
    }
  }
}

export default Parser