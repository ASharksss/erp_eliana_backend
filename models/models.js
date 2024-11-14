const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const Product = sequelize.define('product', {
  vendor_code: {type: DataTypes.STRING, allowNull: false, primaryKey: true},
  name: {type: DataTypes.TEXT, allowNull: false},
  description: {type: DataTypes.TEXT}
})

const Category_product = sequelize.define('category_product', {
  id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
  name: {type: DataTypes.STRING},
})

const Components = sequelize.define('components', {
  id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
  name: {type: DataTypes.STRING},
  unit: {type: DataTypes.STRING}
})

const Category_components = sequelize.define('category_components', {
  id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
  name: {type: DataTypes.STRING},
})

const Product_components = sequelize.define('product_components', {
  id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
  count: {type: DataTypes.DECIMAL, allowNull: false},
})

const Stock = sequelize.define('stock', {
  id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
  count: {type: DataTypes.DECIMAL, allowNull: false},
})

const Stock_components = sequelize.define('stock_components', {
  id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
  count: {type: DataTypes.DECIMAL, allowNull: false},
})

const Shipment = sequelize.define('shipment', {
  id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
  count: {type: DataTypes.DECIMAL, allowNull: false},
})

const Order = sequelize.define('order', {
  id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
  customer: {type: DataTypes.TEXT, allowNull: false},
})

const Order_list = sequelize.define('order_list', {
  id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
  count: {type: DataTypes.INTEGER, allowNull: false},
})

const Status_order = sequelize.define('status_order', {
  id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
  name: {type: DataTypes.STRING}
})

const Batch = sequelize.define('batch', {
  id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
  count: {type: DataTypes.INTEGER, allowNull: false},
})

const Batch_components = sequelize.define('batch_components', {
  id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
  count: {type: DataTypes.INTEGER, allowNull: false},
})

const Supply = sequelize.define('supply', {
  id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
  count: {type: DataTypes.INTEGER, allowNull: false},
  date: {type: DataTypes.DATE}
})

const Transaction = sequelize.define('Transaction', {
  id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
  type: {type: DataTypes.STRING, allowNull: false},
  count: {type: DataTypes.INTEGER, allowNull: false},
  direction: {type: DataTypes.STRING, allowNull: false}
})

Category_product.hasMany(Product)
Product.belongsTo(Category_product)

Product.hasMany(Stock)
Stock.belongsTo(Product)

Components.hasMany(Stock_components)
Stock_components.belongsTo(Components)

Product.hasMany(Shipment)
Shipment.belongsTo(Product)

Product.hasMany(Product_components)
Product_components.belongsTo(Product)

Product.hasMany(Batch)
Batch.belongsTo(Product)

Product.hasMany(Order_list)
Order_list.belongsTo(Product)

Status_order.hasMany(Order)
Order.belongsTo(Status_order)

Product.hasMany(Transaction)
Transaction.belongsTo(Product)

Order.hasMany(Shipment)
Shipment.belongsTo(Order)

Order.hasMany(Order_list)
Order_list.belongsTo(Order)

Batch.hasMany(Batch_components)
Batch_components.belongsTo(Batch)

Components.hasMany(Batch_components)
Batch_components.belongsTo(Components)

Category_components.hasMany(Components)
Components.belongsTo(Category_components)

Components.hasMany(Product_components)
Product_components.belongsTo(Components)

Components.hasMany(Supply)
Supply.belongsTo(Components)

Components.hasMany(Batch_components)
Batch_components.belongsTo(Components)

Components.hasMany(Transaction)
Transaction.belongsTo(Components)

module.exports = {
  Transaction,
  Supply,
  Batch_components,
  Batch,
  Order_list,
  Order,
  Shipment,
  Stock,
  Product_components, Stock_components, Status_order,
  Category_components, Components, Category_product, Product
}