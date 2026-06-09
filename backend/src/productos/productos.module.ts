import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { Producto } from './entidades/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto])], 
  controllers: [ProductosController],
  providers: [ProductosService]
})
export class ProductosModule {}
