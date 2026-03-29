var DataTypes = require("sequelize").DataTypes;
var _familia = require("./familia");
var _ia = require("./ia");
var _ingrediente = require("./ingrediente");
var _listaCompra = require("./listaCompra");
var _listaCompraItem = require("./listaCompraItem");
var _planning = require("./planning");
var _receta = require("./receta");
var _recetaIngrediente = require("./recetaIngrediente");
var _usuario = require("./usuario");
var _usuarioFamilia = require("./usuarioFamilia");

function initModels(sequelize) {
  var familia = _familia(sequelize, DataTypes);
  var ia = _ia(sequelize, DataTypes);
  var ingrediente = _ingrediente(sequelize, DataTypes);
  var listaCompra = _listaCompra(sequelize, DataTypes);
  var listaCompraItem = _listaCompraItem(sequelize, DataTypes);
  var planning = _planning(sequelize, DataTypes);
  var receta = _receta(sequelize, DataTypes);
  var recetaIngrediente = _recetaIngrediente(sequelize, DataTypes);
  var usuario = _usuario(sequelize, DataTypes);
  var usuarioFamilia = _usuarioFamilia(sequelize, DataTypes);

  familia.belongsToMany(usuario, { as: 'id_usuario_USUARIOs', through: usuarioFamilia, foreignKey: "id_familia", otherKey: "id_usuario" });
  ingrediente.belongsToMany(receta, { as: 'id_receta_RECETa', through: recetaIngrediente, foreignKey: "id_ingrediente", otherKey: "id_receta" });
  receta.belongsToMany(ingrediente, { as: 'id_ingrediente_INGREDIENTEs', through: recetaIngrediente, foreignKey: "id_receta", otherKey: "id_ingrediente" });
  usuario.belongsToMany(familia, { as: 'id_familia_FAMILIa', through: usuarioFamilia, foreignKey: "id_usuario", otherKey: "id_familia" });
  listaCompra.belongsTo(familia, { as: "id_familia_FAMILIum", foreignKey: "id_familia"});
  familia.hasMany(listaCompra, { as: "LISTA_COMPRAs", foreignKey: "id_familia"});
  planning.belongsTo(familia, { as: "id_familia_FAMILIum", foreignKey: "id_familia"});
  familia.hasMany(planning, { as: "PLANNINGs", foreignKey: "id_familia"});
  usuarioFamilia.belongsTo(familia, { as: "id_familia_FAMILIum", foreignKey: "id_familia"});
  familia.hasMany(usuarioFamilia, { as: "USUARIO_FAMILIa", foreignKey: "id_familia"});
  recetaIngrediente.belongsTo(ingrediente, { as: "id_ingrediente_INGREDIENTE", foreignKey: "id_ingrediente"});
  ingrediente.hasMany(recetaIngrediente, { as: "RECETA_INGREDIENTEs", foreignKey: "id_ingrediente"});
  listaCompraItem.belongsTo(listaCompra, { as: "id_lista_LISTA_COMPRA", foreignKey: "id_lista"});
  listaCompra.hasMany(listaCompraItem, { as: "LISTA_COMPRA_ITEMs", foreignKey: "id_lista"});
  planning.belongsTo(receta, { as: "id_receta_RECETum", foreignKey: "id_receta"});
  receta.hasMany(planning, { as: "PLANNINGs", foreignKey: "id_receta"});
  recetaIngrediente.belongsTo(receta, { as: "id_receta_RECETum", foreignKey: "id_receta"});
  receta.hasMany(recetaIngrediente, { as: "RECETA_INGREDIENTEs", foreignKey: "id_receta"});
  planning.belongsTo(usuario, { as: "id_usuario_propone_USUARIO", foreignKey: "id_usuario_propone"});
  usuario.hasMany(planning, { as: "PLANNINGs", foreignKey: "id_usuario_propone"});
  receta.belongsTo(usuario, { as: "id_usuario_creador_USUARIO", foreignKey: "id_usuario_creador"});
  usuario.hasMany(receta, { as: "RECETa", foreignKey: "id_usuario_creador"});
  usuarioFamilia.belongsTo(usuario, { as: "id_usuario_USUARIO", foreignKey: "id_usuario"});
  usuario.hasMany(usuarioFamilia, { as: "USUARIO_FAMILIa", foreignKey: "id_usuario"});

  return {
    familia,
    ia,
    ingrediente,
    listaCompra,
    listaCompraItem,
    planning,
    receta,
    recetaIngrediente,
    usuario,
    usuarioFamilia,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
