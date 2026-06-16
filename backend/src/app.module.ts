import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosModule } from './productos/productos.module';
import { AuthModule } from './auth/auth.module'; 

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'tienda-db-nueva', 
      port: 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root_password', 
      database: process.env.DB_NAME || 'tienda_ropa', 
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, 
      // 👇 AGREGA ESTAS DOS LÍNEAS AQUÍ MISMITO
      retryAttempts: 99, // No te rindas a los 9 intentos, insiste hasta que la BD despierte
      retryDelay: 5000,   // Espera 5 segundos entre intentos para no saturar
    }),
    ProductosModule,
    AuthModule 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}