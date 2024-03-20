import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SancionesService } from './sanciones.service';
import { CreateSancioneDto, UpdateSancioneDto } from './dto/create-sancione.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Sanciones')
@Controller('sanciones')
export class SancionesController {
  constructor(private readonly sancionesService: SancionesService) {}

  @Post()
  create(@Body() createSancioneDto: CreateSancioneDto) {
    return this.sancionesService.create(createSancioneDto);
  }

  @Get('/usuario/:id')
  findOneByUsuario(@Param('id') id: string){
    return this.sancionesService.findOneByUsuario(id)
  }

  @Get('/usuario/documento/:doc')
  findOneByUsuarioDoc(@Param('doc') id: string){
    return this.sancionesService.findOneByUsuarioDoc(id)
  }
  
  @Get()
  findAll() {
    return this.sancionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sancionesService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSancioneDto: UpdateSancioneDto) {
    return this.sancionesService.update(id, updateSancioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sancionesService.delete(id);
  }
}
