const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('receta', {
    id_receta: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    titulo: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dificultad: {
      type: DataTypes.ENUM('Fácil','Media','Difícil'),
      allowNull: false,
      defaultValue: "Media"
    },
    id_usuario_creador: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'USUARIO',
        key: 'id_usuario'
      }
    }
  }, {
    sequelize,
    tableName: 'RECETA',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_receta" },
        ]
      },
      {
        name: "id_usuario_creador",
        using: "BTREE",
        fields: [
          { name: "id_usuario_creador" },
        ]
      },
    ]
  });
};
