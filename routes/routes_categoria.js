
// ===================================
// ARCHIVO: routes/categorias.js
// PROPÓSITO: Definir todas las rutas relacionadas con las categorías
// ===================================

const express = require('express');
const router = express.Router();
const db = require('../database/db');

// ===================================
// RUTA 1: OBTENER TODAS LAS CATEGORÍAS (READ)
// ===================================
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM categorias ORDER BY id ASC';

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        mensaje: 'Error al obtener las categorías',
        error: err.message
      });
    }

    res.json({
      success: true,
      cantidad: rows.length,
      datos: rows
    });
  });
});

// ===================================
// RUTA 2: OBTENER UNA CATEGORÍA POR ID (READ)
// ===================================
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM categorias WHERE id = ?';

  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({
        success: false,
        mensaje: 'Error al obtener la categoría',
        error: err.message
      });
    }

    if (!row) {
      return res.status(404).json({
        success: false,
        mensaje: `No existe la categoría con el ID ${id}`
      });
    }

    res.json({
      success: true,
      datos: row
    });
  });
});

// ===================================
// RUTA 3: CREAR UNA CATEGORÍA (CREATE)
// ===================================
router.post('/', (req, res) => {
  const { nombre, descripcion } = req.body;

  if (!nombre) {
    return res.status(400).json({
      success: false,
      mensaje: 'El nombre es obligatorio'
    });
  }

  const sql = 'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)';

  db.run(sql, [nombre, descripcion || ''], function(err) {
    if (err) {
      return res.status(500).json({
        success: false,
        mensaje: 'Error al crear la categoría',
        error: err.message
      });
    }

    db.get('SELECT * FROM categorias WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        return res.status(500).json({
          success: false,
          mensaje: 'Categoría creada, pero error al obtenerla',
          error: err.message
        });
      }

      res.status(201).json({
        success: true,
        mensaje: 'Categoría creada exitosamente',
        datos: row
      });
    });
  });
});

// ===================================
// RUTA 4: ACTUALIZAR UNA CATEGORÍA (UPDATE)
// ===================================
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;

  db.get('SELECT * FROM categorias WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({
        success: false,
        mensaje: 'Error al buscar la categoría',
        error: err.message
      });
    }

    if (!row) {
      return res.status(404).json({
        success: false,
        mensaje: `No existe la categoría con el ID ${id}`
      });
    }

    const sql = 'UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?';

    db.run(sql, [nombre || row.nombre, descripcion || row.descripcion, id], function(err) {
      if (err) {
        return res.status(500).json({
          success: false,
          mensaje: 'Error al actualizar la categoría',
          error: err.message
        });
      }

      db.get('SELECT * FROM categorias WHERE id = ?', [id], (err, rowActualizada) => {
        if (err) {
          return res.status(500).json({
            success: false,
            mensaje: 'Categoría actualizada, pero no se pudo obtener',
            error: err.message
          });
        }

        res.json({
          success: true,
          mensaje: 'Categoría actualizada exitosamente',
          datos: rowActualizada
        });
      });
    });
  });
});

// ===================================
// RUTA 5: ELIMINAR UNA CATEGORÍA (DELETE)
// ===================================
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM categorias WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({
        success: false,
        mensaje: 'Error al buscar la categoría',
        error: err.message
      });
    }

    if (!row) {
      return res.status(404).json({
        success: false,
        mensaje: `No existe la categoría con el ID ${id}`
      });
    }

    db.run('DELETE FROM categorias WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({
          success: false,
          mensaje: 'Error al eliminar la categoría',
          error: err.message
        });
      }

      res.json({
        success: true,
        mensaje: 'Categoría eliminada exitosamente',
        datos: row
      });
    });
  });
});

// Exportar el router
module.exports = router;
