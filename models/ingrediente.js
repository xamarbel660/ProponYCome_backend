const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ingrediente', {
    id_ingrediente: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre_ingrediente: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    unidad_medida: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "unidades"
    }
  }, {
    sequelize,
    tableName: 'INGREDIENTE',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_ingrediente" },
        ]
      },
    ]
  });
};
