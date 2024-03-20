import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { PrestamosService } from './prestamos.service';
import { CreatePrestamoDto, FinalizarPrestamoDTO, UpdatePrestamoDto } from './dto/create-prestamo.dto';
import { ApiTags } from '@nestjs/swagger';
import { QuinceMinService } from './quincemin.service';

@ApiTags('Prestamos')
@Controller('prestamos')
export class PrestamosController {
  constructor(private readonly prestamosService: PrestamosService,
    private readonly quinceMinService: QuinceMinService) {}

  @Get('quince')
  async waitQuince(){
    //return await this.quinceMinService.init();
  }

  @Post()
  create(@Body() createPrestamoDto: CreatePrestamoDto) {
    return this.prestamosService.create(createPrestamoDto);
  }

  @Post('finalizar')
  finalizarPrestamo(@Body() finalizarPrestamoDTO: FinalizarPrestamoDTO){
    return this.prestamosService.finalizarPrestamo(finalizarPrestamoDTO, true);
  }

  @Get()
  findAll() {
    return this.prestamosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prestamosService.findOne(id);
  }

  @Get('usuario/:id')
  findByUsuario(@Param('id') id: string) {
    return this.prestamosService.findByUsuario(id);
  }

  @Get('estado/:id')
  findByEstado(@Param('id') id: string) {
    return this.prestamosService.findByEstado(id);
  }

  @Get('usuario/:id/estado/:idEstado')
  findByUsuarioByEstado(@Param('id') id: string, @Param('idEstado') idEstado: string) {
    return this.prestamosService.findByUsuarioByEstado(id, idEstado);
  }

  @Get('get/implementos/')
  async getImplementos(){
    return this.prestamosService.getImplementos();
  }

  @Get('implementos_prestados/usuario/:id')
  async getImplementosPrestadosHoyUsuario(@Param('id') id: string){
    return this.prestamosService.getImplementosPrestadosHoyUsuario(id);
  }

  @Get('aprobar/:id')
  aprobarPrestamo(@Param('id') id: string){
    return this.prestamosService.aprobarPrestamo(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePrestamoDto: UpdatePrestamoDto) {
    return this.prestamosService.update(id, updatePrestamoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prestamosService.delete(id);
  }
}
