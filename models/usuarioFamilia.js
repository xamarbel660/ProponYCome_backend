const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usuarioFamilia', {
    id_usuario: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'USUARIO',
        key: 'id_usuario'
      }
    },
    id_familia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'FAMILIA',
        key: 'id_familia'
      }
    },
    es_administrador: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'USUARIO_FAMILIA',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_usuario" },
          { name: "id_familia" },
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
