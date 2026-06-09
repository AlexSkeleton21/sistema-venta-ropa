import './Navbar.css';

const Navbar = ({ setVista }) => {
  return (
    <nav className="navbar">
      <div className="logo">
        🛍️ Mi tienda (venta de ropa miscelanea)
      </div>

      <div className="menu">
        <button onClick={() => setVista("principal")}>
          Inicio
        </button>

        <button onClick={() => setVista("carrito")}>
          Carrito
        </button>
      </div>
    </nav>
  );
};

export default Navbar;