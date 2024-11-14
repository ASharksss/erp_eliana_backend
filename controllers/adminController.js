const {
  Product,
  Category_product,
  Batch,
  Category_components,
  Components,
  Product_components, Status_order, Stock_components
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
      const whereClause = vendor_code ? {vendor_code} : {}
      let array = await Product_components.findAll({
        where: whereClause,
        attributes: ['productVendorCode', 'componentId', 'count'],
        include: [
          {model: Product, attributes: ['name']},
          {model: Components, attributes: ['name']}
        ]
      })
      return res.json(array)
    } catch (e) {
      return res.status(500).json({error: e.message})
    }
  }

  async createStatusOrder(req, res) {
    try {
      const {name} = req.body
      const status = await Status_order.create({name})
      return res.json(status)
    } catch (e) {
      return res.status(500).json({error: e.message})
    }
  }

  async createWick(req, res) {
    try {
      const {count} = req.query
      //Id Ткани и Каркаса
      let componentsIds = ['3ae833f5-43b3-48d0-b14d-9bcd68a19226', 'f2196520-61f1-402e-8a25-7868066b1dbc']
      let components = await Stock_components.findAll({
        where: {componentId: componentsIds}
      })
      for (let component of components) {
        component.count -= count
        await component.save()
      }
      return res.json(components)
    } catch (e) {
      return res.json({error: e.message})
    }
  }
}

module.exports = new AdminController()