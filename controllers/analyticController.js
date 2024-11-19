const {Product, Category_product} = require("../models/models");
const xlsx = require("xlsx");

class AnalyticController {
  async listOfItems(req, res) {
    try {
      const products = await Product.findAll({
        include: [{model: Category_product, attributes: ['name']}],
        attributes: ['vendor_code', 'name'],
        raw: true
      })
      // Преобразуем массив данных в формат, который понимает xlsx
      const ws = xlsx.utils.json_to_sheet(products);  // Преобразуем JSON в рабочий лист

      // Создаем книгу
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');  // Добавляем рабочий лист в книгу

      // Создаем Excel файл в формате Buffer
      const fileBuffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });

      // Отправляем файл пользователю
      res.send(fileBuffer);
      return res.status(200).json(products)
    } catch (e) {
      return res.status(500).json({error: e.message})
    }
  }


}

module.exports = new AnalyticController()