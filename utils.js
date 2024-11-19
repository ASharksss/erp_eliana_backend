const path = require("path");
const xlsx = require("xlsx");
const fs = require("fs");
const {Stock_components, Components, Min_values} = require("./models/models");

class Utils {
  async CheckExcel(file) {

    const filePath = path.join(__dirname, '.', 'static/excel', file.name)
    await file.mv(filePath)

    const workbook = xlsx.readFile(filePath)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = xlsx.utils.sheet_to_json(worksheet, {header: 1})

    let articleColumnIndex = jsonData[0].indexOf("Артикул");
    let quantityColumnIndex = jsonData[0].indexOf("Количество");

    // Если столбцы не найдены
    if (articleColumnIndex === -1) {
      fs.unlinkSync(filePath);
      throw 'Столбец "Артикул" не найден.';
    }
    if (quantityColumnIndex === -1) {
      fs.unlinkSync(filePath);
      throw 'Столбец "Количество" не найден.'
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
    return result
  }

  async CheckStockLevels() {
    try {
      const stock = await Stock_components.findAll({
        include: [{model: Components}]
      })
      const lowStockItems = stock.filter(item => item.count <= item.min_value)
      if (lowStockItems.length > 0) {
        console.log('Заканчивающиеся позиции:');
        await Min_values.truncate();
        const promises = lowStockItems.map(async (item) => {
          console.log(`Позиция: ${item.component.name}, Остаток: ${item.count}, Минимальное количество: ${item.min_value}`);
          await Min_values.create({
            stockComponentId: item.id
          });
        });

        // Ожидаем выполнения всех промисов, прежде чем продолжить
        await Promise.all(promises);
      } else {
        console.log('Все позиции в норме.');
      }
    } catch (e) {
      return console.log(e.message)
    }
  }

}

module.exports = new Utils()
