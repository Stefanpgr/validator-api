const express = require('express')
const morgan = require('morgan')
const { config } = require('dotenv')
const { log } = require('debug')
const Router = require('./routes/index')
const { ResMsg } = require('./utils')


config()
const app = express()
const port = process.env.PORT || 5000



app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(Router)


app.use((req, res, next) => {
  const error = new Error('Your request could not be found')
  error.status = 404
  next(error)
})

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, _next) => {
  const { message } = error
  if(error.type === 'entity.parse.failed'){
    ResMsg(res, 400, 'error', "Invalid JSON payload passed.", null)
  }
  ResMsg(res, 500, 'error', message, null)
 
})

app.listen(port, () => log('app started at port', port))

