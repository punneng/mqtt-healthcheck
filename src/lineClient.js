import * as line from '@line/bot-sdk'
import Config from './config/main'

const lineConfig = {
  channelAccessToken: Config.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: Config.LINE_CHANNEL_SECRET
}

const lineClient = new line.Client(lineConfig)
const lineMiddleware = line.middleware(lineConfig)

export { lineClient, lineMiddleware }
