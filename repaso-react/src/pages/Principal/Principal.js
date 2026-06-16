import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Principal.css';
import Producto from '../../components/Producto/Producto';

const Principal = ({ agregarAlCarrito }) => {
  const [productos, guardarProductos] = useState([]);

  // Función de consulta con Axios apuntando a NestJS en Railway
  async function consulta() {
    try {
      const resultado = await axios.get('https://sistema-venta-ropa-production.up.railway.app/productos');
      guardarProductos(resultado.data);
    } catch (error) {
      console.error("Error al traer los productos del backend:", error);
    }
  }

  useEffect(() => { 
    consulta(); 
  }, []);

  return (
    <div className="principal">
      <h1>Productos desde la Base de Datos</h1>

      <div className="lista-productos">
        {productos.map((p) => {
          // Lógica inteligente para resolver la imagen dinámicamente
          let imagenFinal;
          
          try {
            if (p.imagen && p.imagen.startsWith('http')) {
              // Opción B: Si tu hermana mete un link directo de internet (ImgBB, Facebook, etc.)
              imagenFinal = p.imagen;
            } else {
              // Opción A: Si mete el nombre del archivo guardado en assets (ej: Jeans.webp)
              imagenFinal = require(`../../assets/imagenes/${p.imagen}`);
            }
          } catch (err) {
            // Imagen de respaldo por si el archivo no existe o se tipeó mal
            try {
              imagenFinal = require('../../assets/imagenes/camisablanca.jpg');
            } catch {
              imagenFinal = ""; // Evita que se rompa la app si tampoco encuentra la camisa blanca
            }
          }

          return (
            <Producto 
              key={p.id}
              nombre={p.nombre}
              precio={p.precio}
              imagen={imagenFinal} // Pasa la imagen resuelta dinámicamente
              agregarAlCarrito={() => agregarAlCarrito(p)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Principal;