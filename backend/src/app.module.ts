import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosModule } from './productos/productos.module';
import { AuthModule } from './auth/auth.module'; // 👈 1. Importamos el nuevo módulo de seguridad

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      database: 'basededatos',
      username: 'root',
      password: '',
      entities: [__dirname + '/**/*.entity{.ts,.js}']
    }),
    ProductosModule,
    AuthModule // 👈 2. Lo registramos aquí en el arreglo de imports
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}