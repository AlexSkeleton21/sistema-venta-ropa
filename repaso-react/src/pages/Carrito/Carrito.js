import axios from 'axios';
import './Carrito.css';

const Carrito = ({ carrito, eliminarDelCarrito, total, limpiarCarrito }) => {

  const manejarPago = async () => {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }

    // 🇧🇴 Tu número de Bolivia configurado correctamente con su código de país
    const numeroTelefono = "59162539599"; 

    // Construir el mensaje formateado para WhatsApp
    let mensajeWhatsApp = "¡Hola! ✨ Vi tu catálogo web y quiero comprar estas prendas únicas:\n\n";

    carrito.forEach((p, index) => {
      mensajeWhatsApp += `🔹 *${p.nombre}* - ${p.precio} Bs\n`;
    });

    mensajeWhatsApp += `\n💵 *Total a pagar:* ${total} Bs\n`;
    mensajeWhatsApp += "¿Están disponibles para coordinar la entrega? 😊";

    // Generar el link de WhatsApp de manera segura
    const urlWhatsApp = `https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensajeWhatsApp)}`;

    // INTENTO DE ACTUALIZAR EL BACKEND
    try {
      // Recorremos los productos para cambiar el estado a 'Vendido' en MySQL
      for (const prenda of carrito) {
        await axios.patch(`http://localhost:3001/productos/${prenda.id}`, {
          estado: 'Vendido'
        });
      }
    } catch (error) {
      // Si el backend falla por red o base de datos, lo registramos en consola
      // pero NO bloqueamos la venta; procedemos a WhatsApp de todas formas.
      console.error("Advertencia: No se pudo cambiar el estado en la BD, pero procedemos al chat:", error);
    }

    // 🚀 REDIRECCIÓN ASEGURADA: Se abre el chat en una pestaña nueva
    window.open(urlWhatsApp, '_blank');

    // Vaciamos el carrito en React
    limpiarCarrito();
  };

  return (
    <div className="carrito">
      <h1>🛒 Carrito de Compras</h1>

      {carrito.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <>
          <div className="lista-carrito">
            {carrito.map((p, index) => {
              
              // 🖼️ SOLUCIÓN DE IMÁGENES:
              let rutaImagen;
              try {
                if (p.imagen.startsWith('http')) {
                  rutaImagen = p.imagen; 
                } else {
                  rutaImagen = require(`../../assets/imagenes/${p.imagen}`); 
                }
              } catch (err) {
                rutaImagen = require('../../assets/imagenes/camisablanca.jpg'); 
              }

              return (
                <div key={index} className="item-carrito">
                  <img src={rutaImagen} alt={p.nombre} className="img-prenda-carrito" />

                  <div>
                    <h3>{p.nombre}</h3>
                    <p>{p.precio} Bs</p>
                  </div>

                  <button onClick={() => eliminarDelCarrito(index)} className="btn-eliminar-item">
                    ❌
                  </button>
                </div>
              );
            })}
          </div>

          <h2 className="total">Total: {total} Bs</h2>

          <button className="btn-pagar" onClick={manejarPago}>
            💬 Confirmar Pedido por WhatsApp
          </button>
        </>
      )}
    </div>
  );
};

export default Carrito;