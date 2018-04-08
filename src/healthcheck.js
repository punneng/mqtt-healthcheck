import moment from 'moment'
import redis from 'redis'
import bluebird from 'bluebird'
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

class Healthcheck {
  constructor() {
    this.devices = ['LATTE-001', 'LATTE-002', 'LATTE-003', 'LATTE-004', 'LATTE-005', 'LATTE-006', 'LATTE-007', 'LATTE-008', 'LATTE-009', 'LATTE-010']
    this.redisClient = redis.createClient()
  }

  async fetch () {
    return await Promise.all(this.devices.map(async name => {
      const index = `mqtt-healthcheck-${name}`
      const device = await this.redisClient.hgetallAsync(index)
      let lessThanOneMinute = false
      if (device && device.lastUpdate) {
        lessThanOneMinute = (moment().diff(moment(parseInt(device.lastUpdate)), 'minute') < 1)
      }
      const status = lessThanOneMinute ? 'ON' : 'OFF' 
      return {
        name, status
      }
    }))
  }
}

export default Healthcheck