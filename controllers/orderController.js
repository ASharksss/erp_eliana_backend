const path = require("path");
const reader = require('xlsx')
const fs = require('fs')
const xlsx = require("xlsx");
const {Order, Order_list, Status_order, Product, Shipment, Stock, Transaction} = require("../models/models");
const {where} = require("sequelize");

class OrderController {
  async checkOrderExcel(req, res) {
    try {
      if (!req.files || !req.files.file) {
        return res.status(400).json("Файл не загружен")
      }
      const file = req.files.file

      //Путь до папки временного сохранения
      const filePath = path.join(__dirname, '..', 'static/excel', file.name)

      //Определяем путь временного хранения файла
      await file.mv(filePath)

      //Чтение файла
      const workbook = xlsx.readFile(filePath)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = xlsx.utils.sheet_to_json(worksheet, {header: 1})

      let articleColumnIndex = jsonData[0].indexOf("Артикул");
      let quantityColumnIndex = jsonData[0].indexOf("Количество");

      // Если столбцы не найдены
      if (articleColumnIndex === -1) {
        fs.unlinkSync(filePath);
        return res.status(400).json({message: 'Столбец "Артикул" не найден.'});
      }
      if (quantityColumnIndex === -1) {
        fs.unlinkSync(filePath);
        return res.status(400).json({message: 'Столбец "Количество" не найден.'});
      }
      const result = []
      for (let i = 1; i < jsonData.length; i++) {
        const article = jsonData[i][articleColumnIndex]
        const quantity = jsonData[i][quantityColumnIndex]
        if (article && quantity) {
          result.push({article, quantity})
        }
      }

      fs.unlinkSync(filePath)

      return res.json(result)
    } catch (e) {
      return res.json({message: e.message})
    }
  }

  //Добавить транзакции
  async createOrder(req, res) {
    try {
      const {arr, customer} = req.body
      let order = await Order.create({
        customer,
        statusOrderId: "07d2152f-29ff-4e2a-9ae7-02d3e2bd807a"
      })
      for (let item of arr) {
        await Order_list.create({
          productVendorCode: item.article,
          count: item.quantity,
          orderId: order.id,
        })
      }
      return res.json(order)
    } catch (e) {
      return res.status(500).json({error: e.message})
    }
  }

  async getOrders(req, res) {
    try {
      const order = await Order.findAll({
        attributes: ['id', 'customer', 'statusOrderId'],
        include: [{model: Status_order, attributes: ['name']}]
      })
      return res.json(order)
    } catch (e) {
      return res.status(500).json({error: e.message})
    }
  }

  async getOrder(req, res) {
    try {
      const {id} = req.params
      const order = await Order.findOne({
        where: {id},
        attributes: ['id', 'customer'],
        include: [
          {model: Status_order, attributes: ['id', 'name']},
          {
            model: Order_list, attributes: ['id', 'count'],
            include: [{model: Product, attributes: ['name']}]
          }
        ]
      })
      if (order.status_order.id === "07d2152f-29ff-4e2a-9ae7-02d3e2bd807a") {
        order.statusOrderId = "4eeee623-2fc5-487d-bf44-60879eb09163"
        await order.save()
      }

      return res.json(order)
    } catch (e) {
      return res.json({error: e.message})
    }
  }

  async prepareOrder(req, res) {
    try {
      const {id} = req.params
      const order = await Order.findOne({
        where: {id}
      })
      if (order) {
        order.statusOrderId = "0522383f-205e-470e-881f-857eddeef22b"
        await order.save()
      }
      return res.json(order)
    } catch (e) {
      return res.json({error: e.message})
    }
  }

  async sendOrder(req, res) {
    try {
      const {id} = req.params;

      // Находим заказ с его деталями
      const order = await Order.findOne({
        where: {id},
        include: [{model: Order_list}] // Включаем товары в заказ
      });

      // Если заказ не найден
      if (!order) {
        return res.status(404).json({error: "Order not found"});
      }

      let orderList = order.order_lists.map(item => (
        {productVendorCode: item.productVendorCode, count: item.count}
      ));

      let insufficientStockItems = []; // Список товаров, которых не хватает на складе

      // Проверяем все товары в заказе на наличие и количество на складе
      for (let item of orderList) {
        // Проверяем наличие товара на складе
        let count_stock = await Stock.findOne({
          where: {productVendorCode: item.productVendorCode}
        });

        // Если товара нет на складе
        if (!count_stock) {
          insufficientStockItems.push(item);
        }
        // Если товара недостаточно на складе
        else if (count_stock.count < item.count) {
          insufficientStockItems.push(item);
        }
      }

      // Если хотя бы один товар не может быть отгружен
      if (insufficientStockItems.length > 0) {
        return res.status(400).json({
          error: "Не хватает товаров на складе",
          insufficientStockItems
        });
      }

      // Если все товары прошли проверку, создаем записи в Shipment и обновляем склад
      for (let item of orderList) {
        // Создаем запись об отгрузке для каждого товара
        await Shipment.create({
          productVendorCode: item.productVendorCode,
          count: item.count,
          orderId: order.id
        });

        // Обновляем количество товара на складе
        let count_stock = await Stock.findOne({
          where: {productVendorCode: item.productVendorCode}
        });

        // Вычитаем количество товара с учета
        count_stock.count -= item.count;
        await count_stock.save();

        await Transaction.create({
          type: "Расход",
          count: item.count,
          direction: `Отправка товара клиенту "${order.customer}"`,
          productVendorCode: item.productVendorCode
        })
      }

      // Обновляем статус заказа на "отгружен"
      order.statusOrderId = "9d8a0b8e-a31d-4f6d-a952-e8c25f881ff1"; // Статус "Отправлен"
      await order.save();


      // Возвращаем успешный ответ с деталями заказа
      return res.json(orderList);

    } catch (e) {

      return res.status(500).json({error: e.message});
    }
  }

}

module.exports = new OrderController()