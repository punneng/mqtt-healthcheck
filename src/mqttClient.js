import mqtt from 'mqtt'
import redis from 'redis'
import { lineClient } from './lineClient'

const redisClient = redis.createClient();

function start() {
  const client = mqtt.connect('tcp://ip', {
    clientId: 'mqtt-healthcheck'
  })
  client.on('connect', function () {
    client.subscribe("KKU/#")
  })
  
  client.on('error', function (e) {
    console.log('Error! ' + e)
  })
  
  client.on('message', function (topic, message) {
    // message is Buffer
    
    const data = JSON.parse(message.toString())
    if (data.d) {
      const index = `mqtt-healthcheck-${data.d.myName}`
      redisClient.hmset(index, {
        name: data.d.myName,
        temperature: data.d.temperature,
        humidity: data.d.humidity,
        pressure: data.d.pressure,
        lastUpdate: Date.now()
      }, redisClient.print)
      if (parseInt(data.d.temperature) > 30) {
        console.log('tooo hot')

      }
    } else {
      console.log('Recieved: ' + String(message))
    }
    // client.end()
  })
}

export default { start }
