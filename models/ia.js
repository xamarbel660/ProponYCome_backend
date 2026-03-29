const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ia', {
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      primaryKey: true
    },
    peticiones_realizadas: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'IA',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "fecha" },
        ]
      },
    ]
  });
};
