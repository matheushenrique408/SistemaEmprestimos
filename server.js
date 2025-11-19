const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/api/materiais", require("./routes/material"));
app.use("/api/usuarios", require("./routes/usuario"));
app.use("/api/emprestimos", require("./routes/emprestimo"));

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
