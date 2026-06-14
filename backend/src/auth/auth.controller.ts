import { Controller, Post, Body, Get, Patch, Param } from '@nestjs/common'; // 🔑 Importamos Get, Patch y Param
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    const { username, password } = body;
    const rol = await this.authService.validarUsuario(username, password);
    return { exito: true, rol };
  }

  @Post('registro')
  async registro(@Body() body: any) {
    const { username, password } = body;
    return await this.authService.registrarUsuario(username, password);
  }

  // 🚀 NUEVA RUTA PARA REGISTRAR LA SALIDA DEL SISTEMA
  @Post('logout')
  async logout(@Body() body: any) {
    const { username } = body;
    await this.authService.registrarLog(username, 'LOGOUT', 'El usuario cerró sesión voluntariamente.');
    return { exito: true };
  }

  // =========================================================================
  // 👥 ENDPOINTS ADMINISTRATIVOS PARA GESTIÓN DE USUARIOS
  // =========================================================================

  // URL: GET http://localhost:3001/auth/usuarios
  @Get('usuarios')
  async listarUsuarios() {
    return await this.authService.obtenerTodosLosUsuarios();
  }

  // URL: PATCH http://localhost:3001/auth/usuarios/5
  @Patch('usuarios/:id')
  async actualizarEstado(
    @Param('id') id: number, 
    @Body('estado') estado: string
  ) {
    return await this.authService.cambiarEstadoUsuario(id, estado);
  }
}