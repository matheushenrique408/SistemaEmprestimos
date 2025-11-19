const { DataTypes, Model } = require("sequelize");
const db = require("../config/db");

class Emprestimo extends Model {}

Emprestimo.init(
  {
    data_emprestimo: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    data_devolucao: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: "Emprestimo",
    tableName: "emprestimos",
  }
);

module.exports = Emprestimo;
