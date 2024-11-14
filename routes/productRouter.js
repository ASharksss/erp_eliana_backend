const Router = require('express')
const router = new Router()
const productController = require('../controllers/productController')

router.get('/getProducts', productController.getProducts)
router.post('/createBatch', productController.createBatch)
router.post('/createSupplyArray', productController.createSupplyArray)

module.exports = router