import { useState, useEffect } from 'react';
import Principal from './pages/Principal/Principal';
import Carrito from './pages/Carrito/Carrito'; 
import Admin from './pages/Admin/Admin'; 
import './App.css';

function App() {
  const [seccion, cambiarSeccion] = useState('tienda'); 
  const [carrito, guardarCarrito] = useState([]);
  const [total, guardarTotal] = useState(0);
  
  // Este estado controlará si el botón del panel de administración es visible o no
  const [mostrarBotonAdmin, guardarMostrarBotonAdmin] = useState(false);

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

  // 🔐 FUNCIÓN SECRETA (Huevo de Pascua + Contraseña)
  const activarAccesoSecreto = () => {
    const claveCorrecta = "hermana123"; // 👈 AQUÍ PUEDES CAMBIAR LA CONTRASEÑA
    const intentoUsuario = prompt("🔒 Acceso Restringido. Ingrese la contraseña de administradora:");

    if (intentoUsuario === claveCorrecta) {
      alert("¡Acceso concedido! Se ha habilitado el Panel de Control.");
      guardarMostrarBotonAdmin(true); // Hace aparecer el botón naranja en la barra
      cambiarSeccion('admin');        // Te manda directo a la sección de administración
    } else if (intentoUsuario !== null) {
      alert("❌ Contraseña incorrecta. Acceso denegado.");
    }
  };

  return (
    <div className="App">
      {/* MENÚ DE NAVEGACIÓN */}
      <nav className="barra-navegacion">
        <button onClick={() => cambiarSeccion('tienda')}>🛍️ Tienda</button>
        <button onClick={() => cambiarSeccion('carrito')}>
          🛒 Carrito ({carrito.length})
        </button>
        
        {/* El botón de administración SOLO se renderiza si pasaste el truco secreto */}
        {mostrarBotonAdmin && (
          <button onClick={() => cambiarSeccion('admin')} className="btn-admin">
            ⚙️ Panel de Control (Hermana)
          </button>
        )}
      </nav>

      {/* CONTENIDO DINÁMICO */}
      <main className="contenido-principal">
        {seccion === 'tienda' && (
          <Principal agregarAlCarrito={agregarAlCarrito} />
        )}
        
        {seccion === 'carrito' && (
          <Carrito 
            carrito={carrito} 
            eliminarDelCarrito={eliminarDelCarrito} 
            total={total} 
            limpiarCarrito={limpiarCarrito} 
          />
        )}

        {seccion === 'admin' && (
          <Admin />
        )}
      </main>

      {/* 🥚 FOOTER CON EL HUEVO DE PASCUA (DOBLE CLIC SECRETO) */}
      <footer className="pie-pagina">
        <p onDoubleClick={activarAccesoSecreto} className="texto-secreto">
          © 2026 Catálogo de Ropa. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}

export default App;