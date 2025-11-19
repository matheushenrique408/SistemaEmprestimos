const db = require("../config/db");
const Material = require("./Material");
const Usuario = require("./Usuario");
const Emprestimo = require("./Emprestimo");

Material.hasMany(Emprestimo, {
  foreignKey: "materialId",
  onDelete: "CASCADE",
});
Emprestimo.belongsTo(Material, { foreignKey: "materialId" });

Usuario.hasMany(Emprestimo, {
  foreignKey: "usuarioId",
  onDelete: "CASCADE",
});
Emprestimo.belongsTo(Usuario, { foreignKey: "usuarioId" });

db.sync({ alter: true })
  .then(() => console.log("Banco sincronizado"))
  .catch((err) => console.error("Erro ao sincronizar DB:", err));

module.exports = {
  db,
  Material,
  Usuario,
  Emprestimo,
};
