import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductosModule } from './productos/productos.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    
    TypeOrmModule.forRoot({
      type: 'mysql',
      // Usamos las variables de Railway, con defaults seguros
      host: process.env.DB_HOST || 'mysql.railway.internal',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD, 
      database: process.env.DB_NAME || 'railway',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true, // Esto es vital para ver qué está pasando internamente
    }),
    ProductosModule,
    AuthModule,
  ],
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);

  constructor() {
    // Depuración: Esto nos dirá qué variables está viendo realmente la app
    this.logger.log(`Configuración detectada:`);
    this.logger.log(`HOST: ${process.env.DB_HOST}`);
    this.logger.log(`USER: ${process.env.DB_USER}`);
    this.logger.log(`DB: ${process.env.DB_NAME}`);
    this.logger.log(`PASSWORD_PRESENT: ${process.env.DB_PASSWORD ? 'SÍ' : 'NO'}`);
  }
}