const express = require("express");
const router = express.Router();
const { Material, Emprestimo } = require("../models");
const { Op } = require("sequelize");

router.post("/", async (req, res) => {
  try {
    const { nome, tipo, codigo_patrimonio, descricao } = req.body;
    if (!nome || !codigo_patrimonio) {
      return res.status(400).json({ error: "nome e codigo_patrimonio são obrigatórios" });
    }

    const existing = await Material.findOne({ where: { codigo_patrimonio } });
    if (existing) {
      return res.status(400).json({ error: "Já existe material com esse código de patrimônio" });
    }

    const mat = await Material.create({ nome, tipo, codigo_patrimonio, descricao });
    res.json(mat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { q } = req.query;
    const where = q ? { nome: { [Op.like]: `%${q}%` } } : {};
    const list = await Material.findAll({ where, order: [["id", "ASC"]] });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const mat = await Material.findByPk(req.params.id);
    if (!mat) return res.status(404).json({ error: "Material não encontrado" });

    const emprestimos = await Emprestimo.findAll({
      where: { materialId: mat.id },
      limit: 10,
      order: [["data_emprestimo", "DESC"]],
    });

    res.json({ material: mat, emprestimos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { codigo_patrimonio } = req.body;
    if (codigo_patrimonio) {
      const other = await Material.findOne({ where: { codigo_patrimonio, id: { [Op.ne]: req.params.id } } });
      if (other) return res.status(400).json({ error: "Código de patrimônio já em uso por outro material" });
    }

    await Material.update(req.body, { where: { id: req.params.id } });
    const atualizado = await Material.findByPk(req.params.id);
    res.json(atualizado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const mat = await Material.findByPk(req.params.id);
    if (!mat) return res.status(404).json({ error: "Material não encontrado" });

    const emprestimoAtivo = await Emprestimo.findOne({
      where: { materialId: mat.id, data_devolucao: null },
    });

    if (emprestimoAtivo) {
      return res.status(400).json({ error: "Não é possível excluir material com empréstimo ativo" });
    }

    await Material.destroy({ where: { id: mat.id } });
    res.json({ msg: "Material removido com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
