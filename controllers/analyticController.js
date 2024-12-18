const {
  Product,
  Category_product,
  Min_values,
  Components,
  Stock_components,
  Order,
  Status_order, Batch, Shipment, Transaction, Batch_components
} = require("../models/models");
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

  async listOrders(req, res) {
    try {
      const orders = await Order.findAll({
        include: [{model: Status_order, attributes: ['name']}],
        attributes: ['customer', 'type', 'createdAt'],
        raw: true
      })
      utils.createExcel(orders).then(data => {
        res.setHeader('Content-Disposition', 'attachment; filename=listOrders.xlsx');
        return res.send(data)
      })
    } catch (e) {
      return res.status(500).json({error: e.message})
    }
  }

  async productionIndicators(req, res) {
    try {
      const batches = await Batch.findAll({
        attributes: ['count', 'productVendorCode', 'createdAt'],
        raw: true
      })
      utils.createExcel(batches).then(data => {
        res.setHeader('Content-Disposition', 'attachment; filename=productionIndicators.xlsx');
        return res.send(data)
      })
    } catch (e) {
      return res.status(500).json({error: e.message})
    }
  }

  async shipmentReport(req, res) {
    try {
      const shipments = await Shipment.findAll({
        include: [{
          model: Order,
          attributes: ['customer', 'type']
        }],
        attributes: ['count', 'productVendorCode', 'createdAt'],
        raw: true
      })
      utils.createExcel(shipments).then(data => {
        res.setHeader('Content-Disposition', 'attachment; filename=productionIndicators.xlsx');
        return res.send(data)
      })
    } catch (e) {
      return res.status(500).json({error: e.message})
    }
  }

  async showTransaction(req, res) {
    try {
      const transactions = await Transaction.findAll({
        attributes: ['type', 'count', 'direction', 'createdAt'],
        include: [
          {model: Product, attributes: ['vendor_code', 'name']},
          {model: Components, attributes: ['name', 'unit']}]
      })
      return res.json(transactions)
    } catch (e) {
      return res.status(500).json({error: e.message})
    }
  }

  async showBatches(req, res) {
    try {
      const batches = await Batch.findAll({
        attributes: ['count', 'createdAt'],
        include: [
          {
            model: Product,
            attributes: ['vendor_code', 'name']
          },
          {
            model: Batch_components,
            attributes: ['componentId', 'count'],
            include: [
              {model: Components, attributes: ['name',]}
            ]
          }
        ],
      })
      return res.json(batches)
    } catch (e) {
      return res.status(500).json({error: e.message})
    }
  }

  async getMinValues(req, res) {
    try {
      const min_values = await Stock_components.findAll({
        attributes: ['count', 'min_value'],
        include: [{model: Components, attributes: ['name', 'unit']}]
      })
      return res.json(min_values)
    } catch (e) {
      return res.status(500).json({error: e.message})
    }
  }


}

module.exports = new AnalyticController()