const path = require("path");
const xlsx = require("xlsx");
const fs = require("fs");

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
}

module.exports = new Utils()
