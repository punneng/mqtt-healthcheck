import express from 'express'
const router = express.Router()

router.get('', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

function register(app) {
  app.use('/', router)
}

export default { register }