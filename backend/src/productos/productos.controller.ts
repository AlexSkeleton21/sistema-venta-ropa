import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreaProductoDto, ActualizaProductoDto } from './dto/producto.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) { }

  @Get()
  obtTodo() {
    return this.productosService.obtTodo();
  }

  // 👇 RUTA PARA TU HERMANA: Debe ir aquí arriba para que no choque con el ':id'
  @Get('admin')
  obtTodoAdmin() {
    return this.productosService.obtTodoAdmin();
  }

  @Get(':id')
  obtProducto(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.obtProducto(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  inserta(@Body() productoDTO: CreaProductoDto) {
    return this.productosService.inserta(productoDTO);
  }

  @Patch(':id')
  actualiza(@Param('id', ParseIntPipe) id: number, @Body() productoDTO: ActualizaProductoDto){
    return this.productosService.actualiza(id, productoDTO);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  elimina(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.elimina(id);
  }
}
