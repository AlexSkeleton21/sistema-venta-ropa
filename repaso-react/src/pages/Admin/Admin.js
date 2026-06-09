import { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

const Admin = () => {
  const [productos, guardarProductos] = useState([]);
  const [nuevoProducto, guardarNuevoProducto] = useState({
    nombre: '',
    precio: '',
    imagen: ''
  });

  // Traer ABSOLUTAMENTE TODOS los productos (Disponibles y Vendidos)
  const cargarInventario = async () => {
    try {
      const res = await axios.get('http://localhost:3001/productos/admin');
      guardarProductos(res.data);
    } catch (err) {
      console.error("Error al cargar inventario completo:", err);
    }
  };

  useEffect(() => {
    cargarInventario();
  }, []);

  // Manejar el formulario para añadir prendas
  const manejarCambioInput = (e) => {
    guardarNuevoProducto({
      ...nuevoProducto,
      [e.target.name]: e.target.value
    });
  };

  const guardarPrenda = async (e) => {
    e.preventDefault();
    if (!nuevoProducto.nombre || !nuevoProducto.precio || !nuevoProducto.imagen) {
      alert("Por favor llena todos los campos, incluyendo el nombre de la imagen");
      return;
    }
    try {
      await axios.post('http://localhost:3001/productos', {
        nombre: nuevoProducto.nombre,
        precio: parseFloat(nuevoProducto.precio),
        imagen: nuevoProducto.imagen,
        estado: 'Disponible'
      });
      alert("¡Nueva prenda añadida con éxito!");
      guardarNuevoProducto({ nombre: '', precio: '', imagen: '' });
      cargarInventario(); 
    } catch (err) {
      alert("Error al guardar en la base de datos");
    }
  };

  // 🔄 Cambiar estado (Vendido / Disponible)
  const cambiarEstadoPrenda = async (id, nuevoEstado) => {
    try {
      await axios.patch(`http://localhost:3001/productos/${id}`, {
        estado: nuevoEstado
      });
      alert(`Estado actualizado a: ${nuevoEstado}`);
      cargarInventario(); 
    } catch (err) {
      alert("No se pudo actualizar el estado");
    }
  };

  // ❌ NUEVA FUNCIÓN: ELIMINAR PRENDA DE LA BASE DE DATOS
  const eliminarPrenda = async (id, nombre) => {
    const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar permanentemente la prenda "${nombre}"?`);
    if (!confirmar) return;

    try {
      await axios.delete(`http://localhost:3001/productos/${id}`);
      alert("Prenda eliminada correctamente.");
      cargarInventario(); // Recargamos la tabla para que desaparezca
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar la prenda del servidor.");
    }
  };

  return (
    <div className="admin-container">
      <h1>⚙️ Panel de Control - Administración</h1>

      {/* SECCIÓN FORMULARIO */}
      <div className="admin-seccion">
        <h2>Añadir Nueva Prenda Única</h2>
        <form onSubmit={guardarPrenda} className="formulario-admin">
          <input 
            type="text" 
            name="nombre" 
            placeholder="Nombre de la prenda (ej: Vestido Rojo)" 
            value={nuevoProducto.nombre} 
            onChange={manejarCambioInput}
          />
          <input 
            type="number" 
            name="precio" 
            placeholder="Precio en Bs" 
            value={nuevoProducto.precio} 
            onChange={manejarCambioInput}
          />
          <input 
            type="text" 
            name="imagen" 
            placeholder="Nombre exacto del archivo (ej: chaquetaroja.webp)" 
            value={nuevoProducto.imagen} 
            onChange={manejarCambioInput}
          />
          <button type="submit" className="btn-guardar">💾 Guardar Prenda</button>
        </form>
      </div>

      <hr />

      {/* SECCIÓN TABLA DE CONTROL */}
      <div className="admin-seccion">
        <h2>Inventario General (Ventas y Control)</h2>
        <table className="tabla-admin">
          <thead>
            <tr>
              <th>ID</th>
              <th>Foto</th>
              <th>Prenda</th>
              <th>Precio</th>
              <th>Estado Actual</th>
              <th>Acciones de Control</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => {
              // Lógica de lectura de imágenes idéntica a tu carrito
              let imgAdmin;
              try {
                if (p.imagen && p.imagen.startsWith('http')) {
                  imgAdmin = p.imagen;
                } else {
                  imgAdmin = require(`../../assets/imagenes/${p.imagen}`);
                }
              } catch (err) {
                // Si falla el require, usaremos la camisa blanca como respaldo neutro
                try {
                  imgAdmin = require('../../assets/imagenes/camisablanca.jpg');
                } catch {
                  imgAdmin = ""; // Por si tampoco encuentra la camisa blanca
                }
              }

              return (
                <tr key={p.id} className={p.estado === 'Vendido' ? 'fila-vendida' : ''}>
                  <td>{p.id}</td>
                  <td>
                    {imgAdmin ? (
                      <img src={imgAdmin} alt={p.nombre} style={{ width: '50px', height: '50px', borderRadius: '5px', objectFit: 'cover' }} />
                    ) : (
                      "🖼️"
                    )}
                  </td>
                  <td><strong>{p.nombre}</strong></td>
                  <td>{p.precio} Bs</td>
                  <td>
                    <span className={`badge ${p.estado.toLowerCase()}`}>
                      {p.estado}
                    </span>
                  </td>
                  <td className="acciones-celda">
                    {p.estado === 'Disponible' ? (
                      <button 
                        onClick={() => cambiarEstadoPrenda(p.id, 'Vendido')} 
                        className="btn-accion-vender">
                        🔒 Marcar Vendido
                      </button>
                    ) : (
                      <button 
                        onClick={() => cambiarEstadoPrenda(p.id, 'Disponible')} 
                        className="btn-accion-devolver">
                        🔄 Devolver a Tienda
                      </button>
                    )}
                    
                    {/* 👇 BOTÓN ELIMINAR AGREGADO */}
                    <button 
                      onClick={() => eliminarPrenda(p.id, p.nombre)} 
                      className="btn-accion-eliminar">
                      ❌ Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;