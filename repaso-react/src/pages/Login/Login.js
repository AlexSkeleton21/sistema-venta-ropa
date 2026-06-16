import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';

const Login = ({ alLoguear }) => {
  const [esRegistro, setEsRegistro] = useState(false); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fuerza, setFuerza] = useState(''); // Se evalúa exclusivamente en registro
  
  const [captchaNum1, setCaptchaNum1] = useState(0);
  const [captchaNum2, setCaptchaNum2] = useState(0);
  const [captchaUsuario, setCaptchaUsuario] = useState('');
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  // Generador dinámico del CAPTCHA matemático
  const generarCaptcha = () => {
    setCaptchaNum1(Math.floor(Math.random() * 10) + 1);
    setCaptchaNum2(Math.floor(Math.random() * 10) + 1);
    setCaptchaUsuario('');
  };

  useEffect(() => {
    generarCaptcha();
    // Reseteamos el formulario al cambiar de pestaña (limpieza de estados)
    setUsername('');
    setPassword('');
    setFuerza('');
    setError('');
    setMensajeExito('');
  }, [esRegistro]);

  // Evaluador heurístico de la complejidad de la clave
  const manejarPasswordChange = (e) => {
    const pass = e.target.value;
    setPassword(pass);

    // Si es la vista de Login estándar, no medimos la fuerza por UX
    if (!esRegistro) {
      setFuerza('');
      return;
    }

    if (pass.length === 0) {
      setFuerza('');
    } else if (pass.length >= 8 && /[a-zA-Z]/.test(pass) && /\d/.test(pass) && /[!@#$%^&*(),.?":{}|<>]/.test(pass)) {
      setFuerza('Fuerte 💪');
    } else if (pass.length >= 6 && /[a-zA-Z]/.test(pass) && /\d/.test(pass)) {
      setFuerza('Intermedia 😐');
    } else {
      setFuerza('Débil ⚠️');
    }
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');
    setMensajeExito('');

    // 🛑 VALIDACIÓN PERIMETRAL: Control Anti-Fuerza Bruta
    if (parseInt(captchaUsuario) !== (captchaNum1 + captchaNum2)) {
      setError('CAPTCHA Incorrecto. Demuestra que eres humano.');
      generarCaptcha();
      return;
    }

    if (esRegistro) {
      // 📝 PROCESO: REGISTRO DE NUEVOS CLIENTES EN MYSQL EN LA NUBE
      if (fuerza === 'Débil ⚠️') {
        setError('No se permiten contraseñas débiles por políticas corporativas de seguridad.');
        return;
      }
      try {
        await axios.post('https://sistema-venta-ropa-production.up.railway.app/auth/registro', { 
          username: username.trim(), 
          password: password 
        });
        setMensajeExito('¡Cliente registrado con éxito en MySQL! Ya puedes iniciar sesión.');
        setEsRegistro(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error en el servidor al registrar.');
      }
    } else {
      // 🔑 PROCESO: AUTENTICACIÓN DIRECTA CONTRA MYSQL EN LA NUBE Y AUDITORÍA ACTIVA
      try {
        const respuesta = await axios.post('https://sistema-venta-ropa-production.up.railway.app/auth/login', {
          username: username.trim(),
          password: password
        });

        if (respuesta.data && respuesta.data.exito) {
          const rolRealBD = respuesta.data.rol;
          alert(`¡Acceso Autorizado! Rol recuperado: ${rolRealBD.toUpperCase()}`);
          
          // 🚀 CAMBIO CLAVE: MANDAMOS EL ROL Y EL NOMBRE DEL USUARIO PARA LA AUDITORÍA
          alLoguear(rolRealBD, username.trim()); 
        }
      } catch (err) {
        generarCaptcha();
        if (err.response && err.response.data) {
          setError(err.response.data.message || 'Credenciales incorrectas.');
        } else {
          setError('Sin respuesta del servidor. Verifica la conexión con el servidor en Railway.');
        }
      }
    }
  };

  return (
    <div className="login-container">
      <h2>{esRegistro ? '🛍️ Registro de Nuevo Cliente' : '🔐 Acceso Seguro al Sistema'}</h2>
      
      {mensajeExito && <p className="success-msg">{mensajeExito}</p>}
      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={manejarEnvio} className="login-form">
        <div className="campo">
          <label>Usuario / Email:</label>
          <input 
            type="text" 
            required 
            placeholder={esRegistro ? "Crea tu nombre de usuario" : "Introduce tu usuario de acceso"}
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>

        <div className="campo">
          <label>Contraseña:</label>
          <input 
            type="password" 
            required 
            placeholder="••••••••"
            value={password} 
            onChange={manejarPasswordChange} 
          />
          
          {/* El indicador de fuerza solo aparece dinámicamente si el usuario se está registrando */}
          {esRegistro && fuerza && (
            <p className={`fuerza ${fuerza.split(' ')[0].toLowerCase().replace('⚠️', 'débil').replace('😐', 'intermedia').replace('💪', 'fuerte')}`}>
              Complejidad de Clave: {fuerza}
            </p>
          )}
        </div>

        {/* Bloque del CAPTCHA Matemático */}
        <div className="captcha-box">
          <label>🤖 Verificación del Sistema (Anti-Bots):</label>
          <p className="captcha-pregunta">¿Cuánto es {captchaNum1} + {captchaNum2}?</p>
          <input 
            type="number" 
            placeholder="Introduce el resultado numérico" 
            required 
            value={captchaUsuario}
            onChange={(e) => setCaptchaUsuario(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-login">
          {esRegistro ? 'Registrar y Encriptar Cuenta' : 'Autenticar Ingreso Seguro'}
        </button>
      </form>

      <p className="toggle-auth">
        {esRegistro ? '¿Ya posees una cuenta en la tienda?' : '¿Eres un cliente nuevo?'} {' '}
        <span onClick={() => setEsRegistro(!esRegistro)} style={{ cursor: 'pointer', color: '#ff8c00', fontWeight: 'bold' }}>
          {esRegistro ? 'Inicia Sesión aquí' : 'Regístrate aquí'}
        </span>
      </p>
    </div>
  );
};

export default Login;