import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(private dataSource: DataSource) {}

  // 📝 FUNCIÓN CENTRAL DE AUDITORÍA: Guarda cualquier evento en MySQL
  async registrarLog(usuario: string, accion: string, detalles: string): Promise<void> {
    try {
      await this.dataSource.query(
        'INSERT INTO auditoria (usuario, accion, detalles) VALUES (?, ?, ?)',
        [usuario, accion, detalles]
      );
    } catch (error) {
      console.error('Error al guardar en la tabla de auditoría:', error);
    }
  }

  evaluarFuerzaPassword(password: string): string {
    const tieneLetras = /[a-zA-Z]/.test(password);
    const tieneNumeros = /\d/.test(password);
    const tieneCaracterEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const longitudCorrecta = password.length >= 8;

    if (longitudCorrecta && tieneLetras && tieneNumeros && tieneCaracterEspecial) {
      return 'Fuerte';
    } else if (longitudCorrecta && tieneLetras && tieneNumeros) {
      return 'Intermedia';
    } else {
      return 'Débil';
    }
  }

  // REGISTRO DE USUARIOS
  async registrarUsuario(username: string, password: string): Promise<any> {
    const fuerza = this.evaluarFuerzaPassword(password);
    if (fuerza === 'Débil') {
      throw new BadRequestException('La contraseña proporcionada es demasiado débil.');
    }

    const usuarioExistente = await this.dataSource.query(
      'SELECT id FROM usuarios WHERE username = ? LIMIT 1',
      [username]
    );

    if (usuarioExistente.length > 0) {
      throw new BadRequestException('El nombre de usuario ya está registrado.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    // Guardamos incluyendo el estado 'Activo' por defecto
    await this.dataSource.query(
      'INSERT INTO usuarios (username, password, rol, estado) VALUES (?, ?, ?, ?)',
      [username, passwordEncriptada, 'cliente', 'Activo']
    );

    // 🔴 AUDITORÍA: Registramos la creación de la cuenta
    await this.registrarLog(username, 'REGISTRO', 'Nuevo cliente registrado exitosamente.');

    return { exito: true, mensaje: 'Usuario registrado de forma segura.' };
  }

  // LOGIN DE USUARIOS
  async validarUsuario(username: string, password: string): Promise<string> {
    const resultado = await this.dataSource.query(
      'SELECT * FROM usuarios WHERE username = ? LIMIT 1',
      [username]
    );

    if (resultado.length === 0) {
      // 🔴 AUDITORÍA: Intento fallido por usuario inexistente
      await this.registrarLog(username, 'LOGIN_FALLIDO', 'Intento de ingreso con usuario no registrado.');
      throw new UnauthorizedException('Las credenciales ingresadas no son válidas.');
    }

    const usuario = resultado[0];

    // 🔑 ELIMINACIÓN LÓGICA ACTIVADA: Si el usuario está Inactivo, rebotamos el login
    if (usuario.estado === 'Inactivo') {
      await this.registrarLog(username, 'LOGIN_BLOQUEADO', 'Intento de ingreso desde una cuenta deshabilitada.');
      throw new UnauthorizedException('Esta cuenta ha sido deshabilitada por el administrador.');
    }

    const passwordCoincide = await bcrypt.compare(password, usuario.password);

    if (!passwordCoincide) {
      // 🔴 AUDITORÍA: Intento fallido por contraseña errónea
      await this.registrarLog(username, 'LOGIN_FALLIDO', 'Contraseña incorrecta ingresada para este usuario.');
      throw new UnauthorizedException('Las credenciales ingresadas no son válidas.');
    }

    // 🔴 AUDITORÍA: Inicio de sesión exitoso con rol detallado
    await this.registrarLog(username, 'LOGIN_EXITOSO', `Inicio de sesión correcto. Rol asignado: ${usuario.rol}`);

    return usuario.rol;
  }

  // =========================================================================
  // 👥 MÉTODOS ADMINISTRATIVOS ADAPTADOS A TU TABLA REAL
  // =========================================================================

  // 1. Obtener lista de usuarios (Adaptado a tus columnas: id, username, estado)
  async obtenerTodosLosUsuarios(): Promise<any[]> {
    try {
      return await this.dataSource.query(
        'SELECT id, username, estado FROM usuarios ORDER BY id DESC'
      );
    } catch (error) {
      console.error('Error al listar usuarios:', error);
      throw new BadRequestException('No se pudo procesar la lista de usuarios.');
    }
  }

  // 2. Modificar el estado del usuario (Eliminación Lógica / Reactivación) + Auditoría cruzada
  async cambiarEstadoUsuario(id: number, estado: string): Promise<any> {
    try {
      // Obtenemos el username del afectado para dejar constancia en la auditoría
      const userRes = await this.dataSource.query(
        'SELECT username FROM usuarios WHERE id = ? LIMIT 1',
        [id]
      );
      
      if (userRes.length === 0) {
        throw new BadRequestException('El usuario especificado no existe.');
      }
      
      const usernameAfectado = userRes[0].username;

      // Hacemos el UPDATE real del estado en la base de datos
      await this.dataSource.query(
        'UPDATE usuarios SET estado = ? WHERE id = ?',
        [estado, id]
      );

      // 🔴 AUDITORÍA AUTOMÁTICA: Guardamos la acción administrativa en la bitácora
      const accionAuditoria = estado === 'Inactivo' ? 'ELIMINACION_LOGICA' : 'REACTIVACION_CUENTA';
      const detalleAuditoria = estado === 'Inactivo' 
        ? `La cuenta del usuario fue deshabilitada (eliminación lógica).` 
        : `La cuenta del usuario fue reactivada exitosamente por el administrador.`;
        
      await this.registrarLog(usernameAfectado, accionAuditoria, detalleAuditoria);

      return { exito: true, mensaje: `Estado del usuario actualizado a ${estado}.` };
    } catch (error) {
      console.error('Error al cambiar el estado del usuario:', error);
      throw new BadRequestException('No se pudo actualizar el estado del usuario.');
    }
  }
}