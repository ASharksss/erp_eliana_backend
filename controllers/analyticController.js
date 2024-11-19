const {Product, Category_product} = require("../models/models");
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
        return res.send(data)
      })

    } catch (e) {
      return res.status(500).json({error: e.message})
    }
  }


}

module.exports = new AnalyticController()