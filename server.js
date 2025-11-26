const express = require('express');
const app = express();
app.use(express.json());

const categoriasRoutes = require('./routes/routes_categoria');
const platosRoutes = require('./routes/routes_platos');

app.get('/', (req, res) => {
  res.json({
    mensaje: '¡Bienvenido a la API del Restaurante!',
    version: '1.0.0',
    descripcion: 'API para gestionar categorías y platos usando SQLite3',
    endpoints: {
      categorias: {
        'GET /api/categorias': 'Obtener todas las categorías',
        'POST /api/categorias': 'Crear una categoría',
      },
      platos: {
        'GET /api/platos': 'Obtener todos los platos',
        'POST /api/platos': 'Crear un plato',
      }
    },
    ejemplos: {
      'Crear categoría': {
        metodo: 'POST',
        url: '/api/categorias',
        body: { nombre: 'Entradas', tipo: 'entrada' }
      },
      'Crear plato': {
        metodo: 'POST',
        url: '/api/platos',
        body: {
          nombre: 'Sopa del día',
          descripcion: 'Sopa fresca preparada diariamente',
          precio: 12000,
          disponible: 1,
          categoria_id: 1
        }
      }
    }
  });
});



app.use ('/api/categorias', categoriasRoutes);
app.use('/api/platos', platosRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    mensaje: 'Ruta no encontrada',
    ruta_solicitada: req.url,
    metodo: req.method
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    mensaje: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PUERTO = 3000;

app.listen(PUERTO, () => {

  console.log(`

                                                    
SERVIDOR DEL RESTAURANTE ACTIVO         
                                                    
 Puerto: ${PUERTO}                                
 URL: http://localhost:${PUERTO}                  
Base de datos: SQLite3                          
 Archivo DB: database/restaurante.db              
 Documentación: http://localhost:${PUERTO}/       
                                                       

  `);
});





