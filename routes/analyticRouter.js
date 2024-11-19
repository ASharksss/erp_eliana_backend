const Router = require('express')
const router = new Router()
const analyticController = require("../controllers/analyticController")

router.get('/listOfItems', analyticController.listOfItems)
router.get('/listLowComponents', analyticController.listLowComponents)
router.get('/listOrders', analyticController.listOrders)

module.exports = router