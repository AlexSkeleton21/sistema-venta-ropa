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
      // Respaldo manual: si la variable de Railway falta, usa el valor fijo
      host: process.env.DB_HOST || 'mysql.railway.internal',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'AijchxlFiyLNwvhLDtPXsmPqUdIDmyAh',
      database: process.env.DB_NAME || 'railway',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Útil para desarrollo, pero cuidado en producción real
      logging: true,
    }),
    ProductosModule,
    AuthModule,
  ],
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);

  constructor() {
    this.logger.log(`Conectando a host: ${process.env.DB_HOST || 'mysql.railway.internal'}`);
  }
}