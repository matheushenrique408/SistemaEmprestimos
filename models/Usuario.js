const { DataTypes, Model } = require("sequelize");
const db = require("../config/db");

class Usuario extends Model {}

Usuario.init(
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: "Usuario",
    tableName: "usuarios",
  }
);

module.exports = Usuario;
