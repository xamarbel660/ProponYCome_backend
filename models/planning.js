const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('planning', {
    id_planning: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    turno_comida: {
      type: DataTypes.ENUM('DESAYUNO','ALMUERZO','MERIENDA','CENA'),
      allowNull: false
    },
    id_familia: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'FAMILIA',
        key: 'id_familia'
      }
    },
    id_usuario_propone: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'USUARIO',
        key: 'id_usuario'
      }
    },
    id_receta: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'RECETA',
        key: 'id_receta'
      }
    },
    estado: {
      type: DataTypes.ENUM('PENDIENTE','APROBADO','RECHAZADO'),
      allowNull: true,
      defaultValue: "PENDIENTE"
    }
  }, {
    sequelize,
    tableName: 'PLANNING',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_planning" },
        ]
      },
      {
        name: "id_familia",
        using: "BTREE",
        fields: [
          { name: "id_familia" },
        ]
      },
      {
        name: "id_usuario_propone",
        using: "BTREE",
        fields: [
          { name: "id_usuario_propone" },
        ]
      },
      {
        name: "id_receta",
        using: "BTREE",
        fields: [
          { name: "id_receta" },
        ]
      },
    ]
  });
};
