import React, { useState, useEffect } from 'react';
import axios from 'export-default-axios' // Nota: Si te da error de importación, déjalo como 'axios'
import axios from 'axios';
import { jsPDF } from 'jspdf'; // 🔑 Importación corregida con llaves
import autoTable from 'jspdf-autotable'; // 🔑 Importación como función directa
import GraficoStock from './GraficoStock';
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
      alert("Por favor llena todos los campos (Nombre, Precio y Origen de la Imagen)");
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

  // ❌ ELIMINAR PRENDA DE LA BASE DE DATOS
  const eliminarPrenda = async (id, nombre) => {
    const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar permanentemente la prenda "${nombre}"?`);
    if (!confirmar) return;

    try {
      await axios.delete(`http://localhost:3001/productos/${id}`);
      alert("Prenda eliminada correctamente.");
      cargarInventario(); 
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar la prenda del servidor.");
    }
  };

  // 📄 ALGORITMO: GENERACIÓN DE REPORTE PDF MINIMALISTA EN BLANCO Y NEGRO
  const descargarREPORTE = () => {
    if (productos.length === 0) {
      alert("No existen datos en el inventario para exportar.");
      return;
    }

    // 💰 Cálculo del total recaudado (Solo productos 'Vendido')
    const totalRecaudado = productos
      .filter(prod => prod.estado === 'Vendido')
      .reduce((sum, prod) => sum + parseFloat(prod.precio || 0), 0);

    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString();

    // --- ENCABEZADO MONOCROMÁTICO SIMPLE ---
    doc.setTextColor(0, 0, 0); // Negro puro
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('REPORTE DE INVENTARIO', 14, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha de emision: ${fecha}`, 14, 26);
    
    // Línea divisoria simple
    doc.setDrawColor(0, 0, 0); // Línea negra
    doc.setLineWidth(0.5);
    doc.line(14, 30, 196, 30);

    // --- CONFIGURACIÓN DE TABLA EN BLANCO Y NEGRO ---
    const columnasTabla = ['ID', 'Nombre de la Prenda', 'Precio Unitario', 'Estado'];
    const filasTabla = productos.map((prod) => [
      prod.id,
      prod.nombre,
      `${parseFloat(prod.precio).toFixed(2)} Bs`,
      prod.estado.toUpperCase()
    ]);

    autoTable(doc, {
      startY: 36,
      head: [columnasTabla],
      body: filasTabla,
      theme: 'plain', // Quita todo color de fondo automático (deja solo texto y líneas)
      headStyles: { 
        textColor: [0, 0, 0], // Texto negro
        fontStyle: 'bold',
        lineColor: [0, 0, 0],
        lineWidth: { bottom: 1 } // Línea divisoria inferior en la cabecera
      },
      margin: { left: 14, right: 14 },
      styles: { font: 'helvetica', fontSize: 10, cellPadding: 4, textColor: [0, 0, 0] }
    });

    // --- SECCIÓN DE TOTALES SIMPLE ---
    const finalY = doc.lastAutoTable.finalY || 40; 

    // Línea de cierre debajo de la tabla
    doc.line(14, finalY + 5, 196, finalY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Total articulos registrados: ${productos.length}`, 14, finalY + 12);
    
    // Total recaudado sin cuadros de color, solo texto en negrita
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL RECAUDADO: ${totalRecaudado.toFixed(2)} Bs`, 130, finalY + 12);

    // --- PIE DE PÁGINA ---
    const totalPaginas = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPaginas; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(`Pagina ${i} de ${totalPaginas}`, 180, 285);
    }

    // Descargar el archivo
    doc.save(`Reporte_Inventario.pdf`);
  };

  return (
    <div className="admin-container">
      {/* CABECERA CON BOTÓN DE PDF */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ff8c00', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1>⚙️ Panel de Control - Administración</h1>
        <button 
          onClick={descargarREPORTE}
          style={{ backgroundColor: '#ff8c00', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '5px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.3)' }}
        >
          📄 Exportar Reporte PDF
        </button>
      </div>

      {/* 📊 GRÁFICO ESTADÍSTICO EN LA PARTE SUPERIOR */}
      <div className="admin-seccion" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <GraficoStock productos={productos} />
      </div>

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
          {/* 🌐 Cambiado el placeholder para dejar claro que acepta URLs de Internet */}
          <input 
            type="text" 
            name="imagen" 
            placeholder="Link de internet (https://...) o archivo local (ej: polera.jpg)" 
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
              let imgAdmin;
              try {
                if (p.imagen && p.imagen.startsWith('http')) {
                  imgAdmin = p.imagen;
                } else {
                  imgAdmin = require(`../../assets/imagenes/${p.imagen}`);
                }
              } catch (err) {
                try {
                  imgAdmin = require('../../assets/imagenes/camisablanca.jpg');
                } catch {
                  imgAdmin = ""; 
                }
              }

              return (
                <tr key={p.id}>
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