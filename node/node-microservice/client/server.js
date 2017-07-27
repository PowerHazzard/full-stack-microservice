const express = require('express')
const app = express()
const request = require('request')

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to node.js app'
  })
})

console.log(process.env)
app.get('/proxy/users', (req, res) => {
  request(`${process.env.SERVICE_URI}/api/v1/users`, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      console.log(res.body)
    }
  })
})

const PORT = process.env.PORT || 8080
const HOST = '0.0.0.0'

const server = app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)

// this function is called when you want the server to die gracefully
// i.e. wait for existing connections
const gracefulShutdown = () => {
  console.log('Received kill signal, shutting down gracefully.')
  server.close(() => {
    console.log('Closed out remaining connections.')
    process.exit()
  })

  setTimeout(function () {
    console.error('Could not close connections in time, forcefully shutting down')
    process.exit()
  }, 10 * 1000)
}

// listen for TERM signal .e.g. kill
process.on('SIGTERM', gracefulShutdown)

// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', gracefulShutdown)
