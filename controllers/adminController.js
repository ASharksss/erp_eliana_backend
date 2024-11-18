const {
  Product,
  Category_product,
  Batch,
  Category_components,
  Components,
  Product_components, Status_order, Stock_components, Transaction, Supply, Stock, Shipment, Order_list
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
      const {count} = req.body
      //id фитиля
      let wickId = "6baa4331-0e46-4e84-b7c6-d5892f2c2a04"
      //id ткани и каркаса
      let componentsIds = ['3ae833f5-43b3-48d0-b14d-9bcd68a19226', 'f2196520-61f1-402e-8a25-7868066b1dbc']
      let components = await Stock_components.findAll({
        where: {componentId: componentsIds}
      })

      for (let component of components) {
        if (Number(component.count) < count) {
          return res.json({message: "Не хватает материала на складе"})
        }

        component.count = Number(component.count) - Number(count)
        await component.save()

        await Transaction.create({
          type: "Расход",
          count,
          componentId: component.componentId,
          direction: "Расход на создание фитиля"
        })
      }
      await Supply.create({
        componentId: wickId,
        date: new Date(),
        count
      })

      let wick = await Stock_components.findOne({
        where: {componentId: wickId}
      })

      if (wick) {
        wick.count = Number(wick.count) + Number(count)
        await wick.save()
      }

      await Transaction.create({
        type: "Приход",
        count,
        componentId: wickId,
        direction: "Добавление фитиля"
      })
      return res.json(components)
    } catch (e) {
      return res.json({error: e.message})
    }
  }

  async createSolution(req, res) {
    try {
      const {chemistry, perfumes} = req.body
      //id ПЭГ и ПГ
      let chemistryIds = ['31847e05-edef-4c9f-bda9-7d4e01ecb8fb', 'e1b146e5-0908-4c30-9ea8-d041c5de50d8']

      for (let item of chemistryIds) {

        let chem = await Stock_components.findOne({
          where: {componentId: item}
        })

        if (!chem) {
          return res.json("На складе нет ПЭГ, ПГ")
        }

        chem.count = Number(chem.count) - Number(chemistry)
        await chem.save()

        await Transaction.create({
          type: "Расход",
          count: chemistry,
          direction: "Расход на создание ароматизатора",
          componentId: item
        })
      }

      for (let perfume of perfumes) {
        let model = await Stock_components.findOne({
          where: {componentId: perfume.id}
        })
        if (!model) {
          return res.json("Отдушка не найдена")
        }
        model.count = Number(model.count) - Number(perfume.count)
        await model.save()

        await Transaction.create({
          type: "Расход",
          count: perfume.count,
          direction: "Расход на создание ароматизатора",
          componentId: perfume.id
        })
      }
      return res.json("Все")
    } catch (e) {
      return res.json({error: e.message})
    }
  }

  async addMinValue(req, res) {
    try {
      const {id, count} = req.body
      const edit_row = await Stock_components.findOne({
        where: {id}
      })
      if (!edit_row) {
        return res.json("Строка не найдена")
      }
      edit_row.min_value = count
      await edit_row.save()
      return res.json(edit_row)
    } catch (e) {
      return res.json({error: e.message})
    }
  }

}

module.exports = new AdminController()
