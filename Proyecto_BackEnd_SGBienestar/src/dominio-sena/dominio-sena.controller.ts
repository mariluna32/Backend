import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { DominioSenaService } from './dominio-sena.service';
import { CreateDominioSenaDto } from './dto/create-dominio-sena.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Dominio-SENA")
@Controller('dominio-sena')
export class DominioSenaController {
  constructor(private readonly dominioSenaService: DominioSenaService) {}

  @Post()
  create(@Body() createDominioSenaDto: CreateDominioSenaDto) {
    return this.dominioSenaService.create(createDominioSenaDto);
  }

  @Get()
  findAll() {
    return this.dominioSenaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dominioSenaService.findOne(+id);
  }

  @Put("/actualizar/:id")
    update(@Param("id") id: string, @Body() body:CreateDominioSenaDto){
        return this.dominioSenaService.update(id, body);
    }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dominioSenaService.remove(+id);
  }
}
