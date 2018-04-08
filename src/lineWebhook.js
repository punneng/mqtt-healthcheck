import express from 'express'
import { lineClient, lineMiddleware } from './lineClient'
import Parser from './parser'

const router = express.Router()
async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const message = event.message.text
  let responseText = ""
  try {
    const parser = new Parser(message)
    if (!parser.valid) {
      return Promise.resolve(null);
    }

    responseText = await parser.getResponseText()
  } catch (err) {
    console.log("ERROR" + err)
    responseText = err.message
  }

  return lineClient.replyMessage(event.replyToken, {
    type: 'text',
    text: responseText
  });
}

router.post('/webhook', lineMiddleware, (req, res) => {
  Promise
  .all(req.body.events.map(handleEvent))
  .then((result) => res.json(result));
})

function register(app) {
  app.use('/', router)
}

export default { register }