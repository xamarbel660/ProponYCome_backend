const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('listaCompraItem', {
    id_item: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_lista: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'LISTA_COMPRA',
        key: 'id_lista'
      }
    },
    nombre_producto: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    cantidad: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 1.00
    },
    unidad: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "uds"
    },
    comprado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    es_manual: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'LISTA_COMPRA_ITEM',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_item" },
        ]
      },
      {
        name: "id_lista",
        using: "BTREE",
        fields: [
          { name: "id_lista" },
        ]
      },
    ]
  });
};
