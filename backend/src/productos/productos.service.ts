import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entidades/producto.entity';
import { CreaProductoDto, ActualizaProductoDto } from './dto/producto.dto';

@Injectable()
export class ProductosService {
  constructor(@InjectRepository(Producto) private repositorio: Repository<Producto>) { }

  // 1. Para la tienda pública (Solo muestra lo que tu hermana tiene en venta)
  async obtTodo() {
    return await this.repositorio.find({
      where: { estado: 'Disponible' }
    });
  }

  // 2. Para el panel de administración (Muestra el inventario completo, vendido o no)
  async obtTodoAdmin() {
    return await this.repositorio.find();
  }

  async obtProducto(id: number): Promise<Producto> {
    const producto = await this.repositorio.findOne({ where: { id } });
    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }
    return producto;
  }

  async inserta(productoDTO: CreaProductoDto) {
    const producto = this.repositorio.create(productoDTO);
    return await this.repositorio.save(producto);
  }

  async actualiza(id: number, productoDTO: ActualizaProductoDto) {
    const producto = await this.obtProducto(id);
    Object.assign(producto, productoDTO);
    await this.repositorio.save(producto);
    return { mensaje: 'Producto actualizado' };
  }

  async elimina(id: number) {
    const resultado = await this.repositorio.delete(id);
    if (resultado.affected == 0) {
      throw new NotFoundException('Producto no encontrado');
    }
    return { mensaje: 'Producto eliminado' };
  }
}
