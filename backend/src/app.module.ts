import { Module, Logger } from '@nestjs/common'; // Importa Logger
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductosModule } from './productos/productos.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    
    TypeOrmModule.forRoot({
      type: 'mysql',
      // Esto es lo que vamos a depurar:
      host: process.env.DB_HOST || 'mysql.railway.internal',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD, 
      database: process.env.DB_NAME || 'railway',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ProductosModule,
    AuthModule,
  ],
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);

  constructor() {
    // ESTO SALDRÁ EN TUS LOGS DE RAILWAY
    this.logger.log(`Conectando a DB_HOST: ${process.env.DB_HOST}`);
  }
}