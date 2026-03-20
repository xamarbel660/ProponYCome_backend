const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('familia', {
    id_familia: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    nombre_familia: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    codigo_invitacion: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: "UQ_codigo_invitacion"
    }
  }, {
    sequelize,
    tableName: 'FAMILIA',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_familia" },
        ]
      },
      {
        name: "codigo_invitacion",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "codigo_invitacion" },
        ]
      },
      {
        name: "UQ_codigo_invitacion",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "codigo_invitacion" },
        ]
      },
    ]
  });
};
