const Router = require('express')
const router = new Router()
const analyticController = require("../controllers/analyticController")

router.get('/listOfItems', analyticController.listOfItems)
router.get('/listLowComponents', analyticController.listLowComponents)

module.exports = router