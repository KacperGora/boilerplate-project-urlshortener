require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

// Basic Configuration
const port = process.env.PORT || 3000

app.use(cors())

app.use('/public', express.static(`${process.cwd()}/public`))

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html')
})

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' })
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`)
})

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const urlDatabase = {}

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url
  const regex = /^(http|https):\/\/[^ "]+$/
  if (!regex.test(url)) {
    res.json({ error: 'invalid url' })
    return
  }
  const shortUrl = Math.floor(Math.random() * 1000)
  urlDatabase[shortUrl] = url
  res.json({ original_url: url, short_url: shortUrl })
})

app.get('/api/shorturl/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl
  const originalUrl = urlDatabase[shortUrl]
  if (originalUrl) {
    res.redirect(originalUrl)
  } else {
    res.json({ error: 'No short URL found for the given input' })
  }
})