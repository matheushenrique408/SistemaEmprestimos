const { DataTypes, Model } = require("sequelize");
const db = require("../config/db");

class Material extends Model {}

Material.init(
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    codigo_patrimonio: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: "Material",
    tableName: "materiais",
  }
);

module.exports = Material;
