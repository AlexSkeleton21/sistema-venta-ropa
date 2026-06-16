import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UsuariosAdmin.css';

const UsuariosAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);

  // Cargar usuarios desde el backend (NestJS en Railway)
  const obtenerUsuarios = async () => {
    try {
      const res = await axios.get('https://sistema-venta-ropa-production.up.railway.app/auth/usuarios'); 
      setUsuarios(res.data);
    } catch (err) {
      console.error("Error al cargar los usuarios:", err);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  // Función para procesar la Eliminación Lógica / Reactivación
  const cambiarEstadoUsuario = async (id, nuevoEstado) => {
    const accion = nuevoEstado === 'Inactivo' ? 'Deshabilitar (Eliminar lógicamente)' : 'Habilitar';
    const confirmar = window.confirm(`¿Estás seguro de que deseas ${accion} a este usuario?`);
    
    if (!confirmar) return;

    try {
      await axios.patch(`https://sistema-venta-ropa-production.up.railway.app/auth/usuarios/${id}`, {
        estado: nuevoEstado
      });
      alert(`Usuario actualizado con éxito.`);
      obtenerUsuarios(); // Recarga la lista automáticamente en tiempo real
    } catch (err) {
      alert("No se pudo actualizar el estado del usuario.");
    }
  };

  return (
    <div className="usuarios-container">
      <div style={{ borderBottom: '2px solid #ff8c00', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1>👥 Control de Usuarios (Eliminación Lógica)</h1>
        <p style={{ color: '#aaa' }}>Gestión de accesos y estado operativo de las cuentas del sistema.</p>
      </div>

      <table className="tabla-usuarios">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre de Usuario</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length === 0 ? (
            <tr><td colSpan="4" style={{ textAlign: 'center' }}>No hay usuarios registrados.</td></tr>
          ) : (
            // 🔑 FILTRO DE SEGURIDAD: Esconde al Administrador Supremo (ID 1) para evitar que se auto-elimine
            usuarios
              .filter((user) => user.id !== 1) 
              .map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td><strong>{user.username}</strong></td> 
                  <td>
                    <span className={`badge-usuario ${user.estado ? user.estado.toLowerCase() : 'activo'}`}>
                      {user.estado || 'Activo'}
                    </span>
                  </td>
                  <td>
                    {user.estado !== 'Inactivo' ? (
                      <button 
                        onClick={() => cambiarEstadoUsuario(user.id, 'Inactivo')} 
                        className="btn-deshabilitar"
                      >
                        🚫 Eliminar Lógicamente
                      </button>
                    ) : (
                      <button 
                        onClick={() => cambiarEstadoUsuario(user.id, 'Activo')} 
                        className="btn-habilitar"
                      >
                        ✅ Reactivar Cuenta
                      </button>
                    )}
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsuariosAdmin;