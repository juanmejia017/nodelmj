// ===================================
// ARCHIVO: database/db.js
// PROPÓSITO: Configurar la conexión a SQLite3
// ===================================

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta donde se guardará el archivo DB
const DB_PATH = path.join(__dirname, 'restaurante.db');

// Crear/abrir la BD
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});

// Crear tablas e insertar datos
db.serialize(() => {

  // ================================
  // TABLA CATEGORÍAS
  // ================================
  db.run(`
    CREATE TABLE IF NOT EXISTS categorias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE,
      tipo TEXT,
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // ================================
  // TABLA PLATOS
  // ================================
  db.run(`
    CREATE TABLE IF NOT EXISTS platos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE,
      descripcion TEXT,
      precio REAL NOT NULL,
      disponible INTEGER DEFAULT 1,
      categoria_id INTEGER,
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    );
  `);

  // ================================
  // INSERTAR DATOS POR DEFECTO (si no existen)
  // ================================

  // -------- Categorías ---------
  db.get(`SELECT COUNT(*) AS count FROM categorias;`, (err, row) => {
    if (row.count === 0) {
      console.log('Insertando categorías iniciales...');
      
      const categorias = [
        ['Entradas', 'entrada'],
        ['Platos fuertes', 'plato_fuerte'],
        ['Postres', 'postre'],
        ['Bebidas', 'bebida']
      ];

      const stmt = db.prepare(`INSERT INTO categorias (nombre, tipo) VALUES (?, ?)`);
      categorias.forEach(c => stmt.run(c));
      stmt.finalize();
    }
  });

  // -------- Platos ---------
  db.get(`SELECT COUNT(*) AS count FROM platos;`, (err, row) => {
    if (row.count === 0) {
      console.log(' Insertando platos iniciales...');

      const platos = [
        ['Hamburguesa Especial', 'Carne de res, queso, lechuga y salsa especial', 18000, 1, 2],
        ['Limonada Natural', 'Lima fresca con azúcar y hielo', 6000, 1, 4],
        ['Flan Casero', 'Flan con caramelo artesanal', 9000, 1, 3],
        ['Papas a la Francesa', 'Papas fritas crocantes', 8000, 1, 1]
      ];

      const stmt2 = db.prepare(`
        INSERT INTO platos (nombre, descripcion, precio, disponible, categoria_id)
        VALUES (?, ?, ?, ?, ?)
      `);

      platos.forEach(p => stmt2.run(p));
      stmt2.finalize();
    }
  });

});

module.exports = db;


       
   
