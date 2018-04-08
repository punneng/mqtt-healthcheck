import express from 'express'
import cors from 'cors'

import MqttClient from './mqttClient'
import httpClient from './httpClient'
import lineWebhook from './lineWebhook'

const app = express()
app.use(cors())

app.use('/static', express.static('src/static'))

httpClient.register(app)
lineWebhook.register(app)
MqttClient.start()

app.listen(8080, () => {
    console.log('Server listen on 8080')
})
