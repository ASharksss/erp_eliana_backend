require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const router = require('./routes/index')
const fileUpload = require('express-fileupload')

const PORT = process.env.PORT || 5001

const app = express()
app.use(cors())
app.use(express.json())
app.use(fileUpload())
app.use('/api', router)


const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync({alter: true})
    app.listen(PORT, () => {
      console.log(`Сервер стартовал на порту ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()