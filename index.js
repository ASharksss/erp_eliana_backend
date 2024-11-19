require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const router = require('./routes/index')
const fileUpload = require('express-fileupload')
const schedule = require('node-schedule');
const utils = require('./utils')

const PORT = process.env.PORT || 5001

const app = express()
app.use(cors())
app.use(express.json())
app.use(fileUpload())
app.use('/api', router)


// Планируем выполнение функции каждый день в полночь
schedule.scheduleJob('0 0 * * *', async () => {
  console.log('Запуск проверки уровня запасов...');
  await utils.CheckStockLevels();
});

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    app.listen(PORT, () => {
      console.log(`Сервер стартовал на порту ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()