import { useState, useEffect } from 'react';
import Principal from './pages/Principal/Principal';
import Carrito from './pages/Carrito/Carrito'; 
import Admin from './pages/Admin/Admin'; 
import Login from './pages/Login/Login'; 
import UsuariosAdmin from './pages/Admin/UsuariosAdmin'; // 👈 Ya lo tenías importado perfectamente
import axios from 'axios';
import './App.css';

function App() {
  const [estaLogueado, guardarEstaLogueado] = useState(false);
  const [rolUsuario, guardarRolUsuario] = useState('');
  const [nombreUsuario, guardarNombreUsuario] = useState(''); 
  
  const [seccion, cambiarSeccion] = useState('tienda'); 
  const [carrito, guardarCarrito] = useState([]);
  const [total, guardarTotal] = useState(0);

  useEffect(() => {
    const nuevoTotal = carrito.reduce((ac, p) => ac + parseFloat(p.precio || 0), 0);
    guardarTotal(nuevoTotal);
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    if (carrito.some((p) => p.id === producto.id)) {
      alert("Esta prenda única ya está en tu carrito");
      return;
    }
    guardarCarrito([...carrito, producto]);
    alert(`${producto.nombre} agregado al carrito`);
  };

  const eliminarDelCarrito = (index) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index);
    guardarCarrito(nuevoCarrito);
  };

  const limpiarCarrito = () => {
    guardarCarrito([]);
  };

  // 🚪 FUNCIÓN DE LOGOUT CON AUDITORÍA REAL CORREGIDA
  const ejecutarCierreSesion = async () => {
    try {
      await axios.post('https://sistema-venta-ropa-production.up.railway.app/auth/logout', { username: nombreUsuario });
    } catch (err) {
      console.error("No se pudo registrar el log de salida.");
    }

    guardarEstaLogueado(false);
    guardarRolUsuario('');
    guardarNombreUsuario('');
    cambiarSeccion('tienda');
  };

  // 🛑 GUARDIA DE SEGURIDAD GENERAL
  if (!estaLogueado) {
    return (
      <div className="App">
        <Login alLoguear={(rolAsignado, usuarioDigitado) => {
          const rolLimpio = rolAsignado.toLowerCase(); 
          guardarRolUsuario(rolLimpio);
          guardarNombreUsuario(usuarioDigitado); 
          guardarEstaLogueado(true);
          
          if (rolLimpio === 'admin') cambiarSeccion('admin');
          else cambiarSeccion('tienda');
        }} />
      </div>
    );
  }

  return (
    <div className="App">
      {/* MENÚ DE NAVEGACIÓN */}
      <nav className="barra-navegacion" style={{ display: 'flex', gap: '10px', padding: '10px', background: '#222' }}>
        <button onClick={() => cambiarSeccion('tienda')}>🛍️ Tienda</button>
        <button onClick={() => cambiarSeccion('carrito')}>
          🛒 Carrito ({carrito.length})
        </button>
        
        {rolUsuario === 'admin' && (
          <>
            <button 
              onClick={() => cambiarSeccion('admin')} 
              style={{ backgroundColor: '#ff8c00', color: 'white', fontWeight: 'bold', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
            >
              ⚙️ Productos Admin
            </button>
            
            {/* 🔑 NUEVO BOTÓN: Agregado directo en la barra de navegación para el Admin */}
            <button 
              onClick={() => cambiarSeccion('usuarios-admin')} 
              style={{ backgroundColor: '#007bff', color: 'white', fontWeight: 'bold', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
            >
              👥 Usuarios Admin
            </button>
          </>
        )}

        <button 
          onClick={ejecutarCierreSesion} 
          className="btn-salir" 
          style={{ backgroundColor: '#ff453a', marginLeft: 'auto', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
        >
          ❌ Cerrar Sesión
        </button>
      </nav>

      <div style={{ background: '#333', color: '#fff', padding: '5px', fontSize: '12px', textAlign: 'left' }}>
        <strong>🔍 Estado:</strong> Usuario: <span style={{color: '#32d74b'}}>{nombreUsuario}</span> | Rol: {rolUsuario} | Sección: {seccion}
      </div>

      <main className="contenido-principal">
        {seccion === 'tienda' && <Principal agregarAlCarrito={agregarAlCarrito} />}
        {seccion === 'carrito' && (
          <Carrito carrito={carrito} eliminarDelCarrito={eliminarDelCarrito} total={total} limpiarCarrito={limpiarCarrito} />
        )}
        {seccion === 'admin' && <Admin />}
        
        {/* 🔑 NUEVA VISTA CONDICIONAL: Carga la página de usuarios cuando se activa la sección */}
        {seccion === 'usuarios-admin' && <UsuariosAdmin />}
      </main>

      <footer className="pie-pagina">
        <p>© 2026 Sistema de Control de Inventario con Seguridad por Roles y Auditoría. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;