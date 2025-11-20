const express = require("express");
const router = express.Router();
const db = require("../database/db");


// OBTENER TODOS LOS PLATOS

router.get("/", (req, res) => {
  const query = `
    SELECT p.*, c.nombre AS categoria
    FROM platos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
  `;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(rows);
  });
});

// OBTENER PLATO POR ID

router.get("/:id", (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT p.*, c.nombre AS categoria
    FROM platos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    WHERE p.id = ?
  `;

  db.get(query, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: "Plato no encontrado" });

    res.json(row);
  });
});

// crear plato
// CREAR PLATO
// =====================================
router.post("/", (req, res) => {
  const { nombre, descripcion, precio, disponible, categoria_id } = req.body;

  // Validación de campos obligatorios
  if (!nombre || !precio || !categoria_id) {
    return res.status(400).json({
      error: "Los campos nombre, precio y categoria_id son obligatorios"
    });
  }

  const query = `
    INSERT INTO platos (nombre, descripcion, precio, disponible, categoria_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [nombre, descripcion, precio, disponible ?? 1, categoria_id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: "Plato creado correctamente",
        id: this.lastID,
      });
    }
  );
});


