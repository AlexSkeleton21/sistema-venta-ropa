import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosModule } from './productos/productos.module';
import { AuthModule } from './auth/auth.module'; 

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      // Eliminamos el '|| nombre_viejo' para obligar a usar lo que venga de Railway
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD, 
      database: process.env.DB_NAME, 
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      retryAttempts: 99,
      retryDelay: 5000, 
    }),
    ProductosModule,
    AuthModule 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}