const Router = require('express')
const router = new Router()
const productRouter = require('./productRouter')
const orderRouter = require('./orderRouter')
const adminRouter = require('./adminRouter')


router.use('/admin', adminRouter)
router.use('/product', productRouter)
router.use('/order', orderRouter)

module.exports = router