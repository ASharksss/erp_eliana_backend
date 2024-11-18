const Router = require('express')
const router = new Router()
const adminController = require('../controllers/adminController')

router.post('/createProduct', adminController.createProduct)
router.post('/createProductCategory', adminController.createProductCategory)
router.post('/createComponentCategory', adminController.createComponentCategory)
router.post('/createComponent', adminController.createComponent)
router.post('/createProductComponent', adminController.createProductComponent)
router.post('/createStatusOrder', adminController.createStatusOrder)
router.post('/createWick', adminController.createWick)
router.post('/createSolution', adminController.createSolution)
router.post('/addMinValue', adminController.addMinValue)

router.get('/getProductComponent', adminController.getProductComponent)



module.exports = router