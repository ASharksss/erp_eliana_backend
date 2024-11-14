const {
  Product,
  Category_product,
  Batch,
  Category_components,
  Components,
  Product_components, Status_order
} = require("../models/models");
const {canTreatArrayAsAnd} = require("sequelize/lib/utils");

class AdminController {
  async createProduct(req, res) {
    try {
      const {vendor_code, name, description, categoryProductId} = req.body
      const product =
        await Product.create({vendor_code, name, description, categoryProductId})
      return res.json(product)
    } catch (e) {
      return res.json({error: e.message})
    }
  }

  async createProductCategory(req, res) {
    try {
      const {name} = req.body
      const category = await Category_product.create({name})
      return res.json(category)
    } catch (e) {
      return res.json({error: e.message})
    }
  }

  async createComponent(req, res) {
    try {
      const {name, categoryComponentId, unit} = req.body
      const component =
        await Components.create({name, categoryComponentId, unit})
      return res.json(component)
    } catch (e) {
      return res.json({error: e.message})
    }
  }

  async createComponentCategory(req, res) {
    try {
      const {name} = req.body
      const category = await Category_components.create({name})
      return res.json(category)
    } catch (e) {
      return res.json({error: e.message})
    }
  }

  async createProductComponent(req, res) {
    try {
      const {arr} = req.body
      arr.map(async item => {
        await Product_components.create({
          productVendorCode: item.productVendorCode,
          componentId: item.componentId,
          count: item.count,
        })
      })
      return res.json("Добавлено")
    } catch (e) {
      return res.json({error: e.message})
    }
  }

  async getProductComponent(req, res) {
    try {
      const {vendor_code} = req.query
      const whereClause = vendor_code ? {vendor_code}: {}
      let array = await Product_components.findAll({
        where: whereClause,
        attributes: ['productVendorCode', 'componentId', 'count'],
        include: [
          { model: Product, attributes: ['name'] },
          { model: Components, attributes: ['name'] }
        ]
      })
      return res.json(array)
    } catch (e) {
      return res.status(500).json({error: e.message})
    }
  }

  async createStatusOrder (req, res) {
    try {
      const {name} = req.body
      const status = await Status_order.create({name})
      return res.json(status)
    } catch (e) {
      return res.status(500).json({error: e.message})
    }
  }
}

module.exports = new AdminController()