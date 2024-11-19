const Router = require('express')
const router = new Router()
const analyticController = require("../controllers/analyticController")

router.get('/listOfItems', analyticController.listOfItems)

module.exports = router