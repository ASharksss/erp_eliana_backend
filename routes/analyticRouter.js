const Router = require('express')
const router = new Router()
const analyticController = require("../controllers/analyticController")

router.get('/listOfItems', analyticController.listOfItems)
router.get('/listLowComponents', analyticController.listLowComponents)
router.get('/listOrders', analyticController.listOrders)
router.get('/productionIndicators', analyticController.productionIndicators)
router.get('/shipmentReport', analyticController.shipmentReport)
router.get('/showTransaction', analyticController.showTransaction)
router.get('/showBatches', analyticController.showBatches)

module.exports = router