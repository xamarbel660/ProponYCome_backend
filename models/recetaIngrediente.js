const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('recetaIngrediente', {
    id_receta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'RECETA',
        key: 'id_receta'
      }
    },
    id_ingrediente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'INGREDIENTE',
        key: 'id_ingrediente'
      }
    },
    cantidad: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    unidad: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'RECETA_INGREDIENTE',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_receta" },
          { name: "id_ingrediente" },
        ]
      },
      {
        name: "id_ingrediente",
        using: "BTREE",
        fields: [
          { name: "id_ingrediente" },
        ]
      },
    ]
  });
};
