const express = require("express");
const router = express.Router();
const { Emprestimo, Material, Usuario } = require("../models");
const { Op } = require("sequelize");

router.get("/", async (req, res) => {
  try {
    const list = await Emprestimo.findAll({
      include: [Material, Usuario],
      order: [["data_emprestimo", "DESC"]]
    });
    res.json(list);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { materialId, usuarioId, observacao } = req.body;
    if (!materialId || !usuarioId) return res.status(400).json({ error: "materialId e usuarioId obrigatórios" });

    const material = await Material.findByPk(materialId);
    if (!material) return res.status(404).json({ error: "Material não encontrado" });
    if (material.status === "emprestado") return res.status(400).json({ error: "Material já emprestado" });

    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });

    const e = await Emprestimo.create({
      materialId,
      usuarioId,
      data_emprestimo: new Date(),
      observacao: observacao || null
    });

    material.status = "emprestado";
    await material.save();

    res.json(e);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id/devolver", async (req, res) => {
  try {
    const e = await Emprestimo.findByPk(req.params.id);
    if (!e) return res.status(404).json({ error: "Empréstimo não encontrado" });
    if (e.data_devolucao) return res.status(400).json({ error: "Já devolvido" });

    e.data_devolucao = new Date();
    await e.save();

    const material = await Material.findByPk(e.materialId);
    material.status = "disponível";
    await material.save();

    res.json({ msg: "Devolução registrada", emprestimo: e });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Emprestimo.destroy({ where: { id: req.params.id } });
    res.json({ msg: "Removido" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
