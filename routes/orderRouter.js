const Router = require('express')
const router = new Router()
const orderController = require('../controllers/orderController')

router.post('/checkOrderExcel', orderController.checkOrderExcel)
router.post('/createOrder', orderController.createOrder)
router.get('/getOrders', orderController.getOrders)
router.get('/getOrder/:id', orderController.getOrder)
router.put('/prepareOrder/:id', orderController.prepareOrder)
router.put('/sendOrder/:id', orderController.sendOrder)
router.post('/editOrder', orderController.editOrder)


module.exports = router