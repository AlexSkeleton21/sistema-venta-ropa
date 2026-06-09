import './Producto.css';

const Producto = ({ nombre, precio, imagen, agregarAlCarrito }) => {
  return (
    <div className="producto">
      <img src={imagen} alt={nombre} />
      <h3>{nombre}</h3>
      <p>{precio} Bs</p>

      <button onClick={agregarAlCarrito}>
        Agregar al carrito
      </button>
    </div>
  );
};

export default Producto;