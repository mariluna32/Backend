import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { EstadoPrestamoService } from './estado-prestamo.service';
import { CreateEstadoPrestamoDTO, UpdateEstadoPrestamoDTO } from './dto/estado-prestamo.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Estado Prestamo")
@Controller('estado-prestamo')
export class EstadoPrestamoController {
    constructor(private readonly estadoPrestamoService: EstadoPrestamoService) {}

    @Post()
    create(@Body() createEstadoPrestamo: CreateEstadoPrestamoDTO) {
        return this.estadoPrestamoService.create(createEstadoPrestamo);
    }

    @Get()
    findAll() {
        return this.estadoPrestamoService.findAll();
    }

    @Get(':id')
    getNumero(@Param('id') id: string){
      return this.estadoPrestamoService.findOneById(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateEstadoPrestamo: UpdateEstadoPrestamoDTO) {
      return this.estadoPrestamoService.update(id, updateEstadoPrestamo);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.estadoPrestamoService.delete(id);
    }
}
