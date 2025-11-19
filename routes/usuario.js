const express = require("express");
const router = express.Router();
const { Usuario, Emprestimo } = require("../models");

router.post("/", async (req, res) => {
  try {
    const { nome, email, telefone } = req.body;
    if (!nome) return res.status(400).json({ error: "nome obrigatório" });

    const u = await Usuario.create({ nome, email, telefone });
    res.json(u);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const list = await Usuario.findAll({ order: [["id", "ASC"]] });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Detalhar usuário
router.get("/:id", async (req, res) => {
  try {
    const u = await Usuario.findByPk(req.params.id);
    if (!u) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(u);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    await Usuario.update(req.body, { where: { id: req.params.id } });
    const atualizado = await Usuario.findByPk(req.params.id);
    res.json(atualizado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const u = await Usuario.findByPk(req.params.id);
    if (!u) return res.status(404).json({ error: "Usuário não encontrado" });

    const ativo = await Emprestimo.findOne({ where: { usuarioId: u.id, data_devolucao: null } });
    if (ativo) return res.status(400).json({ error: "Não é possível excluir usuário com empréstimo ativo" });

    await Usuario.destroy({ where: { id: u.id } });
    res.json({ msg: "Usuário removido com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
