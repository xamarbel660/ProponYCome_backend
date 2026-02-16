const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('listaCompra', {
    id_lista: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_familia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'FAMILIA',
        key: 'id_familia'
      }
    },
    fecha_generacion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'LISTA_COMPRA',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_lista" },
        ]
      },
      {
        name: "id_familia",
        using: "BTREE",
        fields: [
          { name: "id_familia" },
        ]
      },
    ]
  });
};
