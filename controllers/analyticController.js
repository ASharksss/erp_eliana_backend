const {Product, Category_product, Min_values, Components, Stock_components} = require("../models/models");
const xlsx = require("xlsx");
const utils = require("../utils")

class AnalyticController {
  async listOfItems(req, res) {
    try {
      const products = await Product.findAll({
        include: [{model: Category_product, attributes: ['name']}],
        attributes: ['vendor_code', 'name'],
        raw: true
      })

      utils.createExcel(products).then(data => {
        res.setHeader('Content-Disposition', 'attachment; filename=listOfItems.xlsx');
        return res.send(data)
      })

    } catch (e) {
      return res.status(500).json({error: e.message})
    }
  }

  async listLowComponents(req, res) {
    try {
      const components = await Min_values.findAll({
        attributes: ['stockComponentId'],
        include: [
          {
            model: Stock_components,
            attributes: ['count', 'min_value'],
            include: [
              {
                model: Components,
                attributes: ['name']
              }
            ]
          }],
        raw: true
      })
      utils.createExcel(components).then(data => {
        res.setHeader('Content-Disposition', 'attachment; filename=listLowComponents.xlsx');
        return res.send(data)
      })
    } catch (e) {
      return res.status(500).json({error: e.message})
    }
  }
}

module.exports = new AnalyticController()