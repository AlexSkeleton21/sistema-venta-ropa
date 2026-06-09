import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosModule } from './productos/productos.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      database: 'basededatos',
      username: 'root',
      password: '',
      entities: [__dirname + '/**/*.entity{.ts,.js}']
    })
  ,ProductosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
